import React, { Component } from 'react';
import io from 'socket.io-client';
import './Chat.scss'
import uniqid from 'uniqid'
import missingImage from './../../assets/Image-missing.webp'
import { connect } from 'react-redux'

class Chat extends Component {
    constructor() {
        super();
        this.state = {
            messages: [],
            message: '',
            setAsButton: true,
            conversationId: '',
            isadmin:false
        }
    }

    componentDidMount() {
        let messages = []
        if(window.localStorage.getItem('messages')){
            messages=JSON.parse(window.localStorage.getItem('messages'))
        }
        this.socket = io()
        let conversationId = uniqid()
        this.setState({
            conversationId,
            messages
        },this.scrollToBottom())
    }

    


    setStateButton = () => {
        const { setAsButton, conversationId } = this.state


        this.setState({
            setAsButton: !setAsButton
        }, () => {
            if (!this.state.setAsButton) {
                this.joinSocket(this.state.conversationId)
                this.scrollToBottom()
            }
        })
    }

    joinSocket = (conversationId) => {
        this.socket.emit('join room', conversationId)
        this.socket.emit('someoneWantsToChat', conversationId)
        this.socket.on('msg', data => {
            this.setState({
                messages: data.messages,
                conversationId: data.conversationId
            })
        })
    }

    updateMessages = (e) => {
        if (e.which === 13) {
            const { message } = this.state
            let messages = this.state.messages.slice()
            messages.push({ message, admin: false })
            this.setState({
                messages: messages,
                message: ''
            }, () => {
                window.localStorage.setItem('messages',JSON.stringify(this.state.messages))
                this.sendMessage(this.state.conversationId, this.state.messages)
            })
        }
    }

    sendMessage = (conversationId, messages) => {
        this.socket.emit('msg', {
            messages, conversationId
        })
        this.scrollToBottom()
    }

    handleInput = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    onSubmit(e) {
        e.preventDefault();
        this.updateMessages(e)
    }

    scrollToBottom() {


        var objDiv = document.getElementById("screen");
        if(objDiv){
            objDiv.scrollTop = objDiv.scrollHeight;
        }
    }

    render() {
        const { message, setAsButton, messages } = this.state
        const { setStateButton, handleInput, updateMessages } = this
        const mapper = messages.map(message => {
            if (message.admin) {
                return (
                    <div id='left'>
                        <p>
                            {message.message}
                        </p>
                    </div>
                )
            }
            else {
                return (
                    <div id='right'>
                        <p>
                            {message.message}
                        </p>
                    </div>
                )
            }
        })

        if (this.props.isadmin) {
            return null
        }

        return (
            <div>
                {setAsButton
                        ? <button onClick={setStateButton} className='chatButton'><i class="fas fa-mobile" id='chatButton'></i></button>
                        : <div className='chatWindow'>
                            <div id='top'>
                                <img src={missingImage} />
                                <p>Customer Support</p>
                                <button onClick={setStateButton}><i class="fas fa-times"></i></button>
                            </div>
                            <div id='screen'>{mapper}</div>
                            <input name='message' value={message} onChange={handleInput} placeholder='Enter message' onKeyPress={updateMessages} />
                        </div>
                }
            </div>
        )
    }
}

const m2p = (state) => {
    return {
        isadmin: state.isadmin
    }
}

export default connect(m2p)(Chat);