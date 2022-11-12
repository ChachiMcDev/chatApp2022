


const socket = io()


const $messageForm = document.querySelector('#message-form')
const $sendLocation = document.querySelector('#send-location')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $messages = document.querySelector('#messages')
const $myLocation = document.querySelector('#myLocation')



//Templats
const messageTemplate = document.querySelector('#message-template').innerHTML
const linkTemplate = document.querySelector('#link-template').innerHTML
const sideBarTemplate = document.querySelector('#sidebar-template').innerHTML

//Options
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })
console.log(username)
console.log(room)

const autoScroll = () => {
    //New message element
    const $newMessage = $messages.lastElementChild

    //Height of the new message
    const newMessageStyles = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

    //Visible height
    const visibleHeight = $messages.offsetHeight

    //Height of messages container
    const containerHeight = $messages.scrollHeight

    //How far have I scrolled?
    const scrollOfset = $messages.scrollTop + visibleHeight

    if (containerHeight - newMessageHeight <= scrollOfset) {
        $messages.scrollTop = $messages.scrollHeight
    }
}


socket.on('message', (data) => {
    console.log(data)
    const html = Mustache.render(messageTemplate, {
        message: data.text,
        userName: data.userName,
        createdAt: moment(data.createdAt).format('MMM Do, h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend', html)

    if (document.querySelector(`#${username}`)) {
        document.querySelector(`#${username}`).style.fontWeight = 'bold'
        document.querySelector(`#${username}`).style.color = 'red'
    }

    autoScroll()
})


socket.on('locationMessage', (locData) => {

    const html = Mustache.render(linkTemplate, {
        location: locData.locLink,
        myLink: 'My Current Location',
        userName: locData.userName,
        createdAt: moment(locData.createdAt).format('MMM Do, h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend', html)
    autoScroll()
})

socket.on('roomData', ({ room, users }) => {
    const html = Mustache.render(sideBarTemplate, {
        room,
        users
    })

    document.querySelector('#sidebar').innerHTML = html
})

$messageForm.addEventListener('submit', (event) => {
    event.preventDefault()

    $messageFormButton.setAttribute('disabled', 'disabled')
    let messageValue = event.target.elements.message.value

    socket.emit('sendMessage', messageValue, (error) => {
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value = ''
        $messageFormInput.focus()

        if (error) {
            return console.log(error)
        }
        console.log('the message was delivered')
    })



})

$sendLocation.addEventListener('click', () => {

    if (!navigator.geolocation) {
        return alert('Geolocation not supported by your browser')
    }

    $sendLocation.setAttribute('disabled', 'disabled')

    navigator.geolocation.getCurrentPosition((position) => {

        socket.emit('sendLocation', {
            lat: position.coords.latitude,
            lon: position.coords.longitude
        }, () => {
            $sendLocation.removeAttribute('disabled')
            console.log('Location has been sent')
        })
    })
})

socket.emit('join', { username, room }, (error) => {
    if (error) {
        alert(error)
        location.href = '/'
    }

    if (document.querySelector(`#${username}`)) {
        document.querySelector(`#${username}`).style.fontWeight = 'bold'
        document.querySelector(`#${username}`).style.color = 'red'
    }

})


