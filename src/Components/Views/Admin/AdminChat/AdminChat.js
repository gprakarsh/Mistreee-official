import React, { Component } from 'react'
import io from 'socket.io-client';
import './AdminChat.scss'

class AdminChat extends Component {

    constructor() {
        super();
        this.state = {
            conversationIdArr: [],
            currentId: '',
            adminMessage: ''
        }
    }


    componentDidMount() {
        this.socket = io()
        this.initializeSockets()
    }


    updateMessages = (e) => {
        const { currentId } = this.state
        if (e.which === 13) {
            const { adminMessage } = this.state
            let messages = this.state[currentId].slice()
            messages.push({ message: adminMessage, admin: true })
            this.setState({
                [currentId]: messages,
                adminMessage: ''
            }, () => {
                this.sendMessage(this.state.currentId, this.state[currentId])
            })
        }
    }

    sendMessage = (conversationId, messages) => {
        this.socket.emit('msg', {
            messages, conversationId
        })
        this.scrollToBottom()
    }

    initializeSockets() {
        let newConversationIdArr = this.state.conversationIdArr.slice()

        this.socket.emit('join room', 'adminChatRoom')
        this.socket.on('someoneWantsToChat', conversationId => {
            this.socket.emit('join room', conversationId)
        })
        this.socket.on('msg', data => {
            const { conversationId, messages } = data
            if (!newConversationIdArr.includes(conversationId)) {
                newConversationIdArr.push(conversationId)
            }
            this.setState({
                [conversationId]: messages,
                conversationIdArr: newConversationIdArr
            })
        })
    }

    handleInput = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    scrollToBottom() {


        var objDiv = document.getElementById("currentConversation");
        if (objDiv) {
            objDiv.scrollTop = objDiv.scrollHeight;
        }
    }

    render() {
        const highlight = (selector) => {
            const userNames = document.querySelectorAll('.userName')
            for (let i = 0; i < userNames.length; i++) {
                if (userNames[i].classList.contains('userNameHighlight')) {
                    userNames[i].classList.remove('userNameHighlight')
                }
            }
            document.querySelector(`${selector}`).classList.add('userNameHighlight')
        }






        const { currentId, adminMessage } = this.state
        const { handleInput, updateMessages, scrollToBottom } = this

        const conversationIdMapper = this.state.conversationIdArr.map(id => {
            return (
                <li className='userName' id={`user-${id}`} onClick={() => {
                    highlight(`#user-${id}`)
                    this.setState({ currentId: id }, this.scrollToBottom())
                }}>
                    {id}
                </li>)
        })

        let conversation = '';

        if (currentId !== '') {
            conversation = this.state[currentId].map(message => {
                if (message.admin) {
                    return (
                        <div id='right'>
                            <p>
                                {message.message}
                            </p>
                        </div>
                    )
                }
                else {
                    return (
                        <div id='left'>
                            <p>
                                {message.message}
                            </p>
                        </div>
                    )
                }
            })

        }

        return (
            <div className='AdminChat'>
                <div className='navAndConvo'>
                    <nav>
                        <ul className='conversationIds'>{conversationIdMapper}</ul>
                    </nav>
                    <div className='currentConversation' id='currentConversation'>
                        {conversation}
                    </div>
                </div>
                <input id='adminMessage' name='adminMessage' value={adminMessage} placeholder='Enter Message' onChange={handleInput} onKeyPress={updateMessages} />
            </div>
        )
    }
}

export default AdminChat