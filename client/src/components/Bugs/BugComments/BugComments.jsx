import React, { useState,useRef,useEffect } from 'react'
import { useSelector } from 'react-redux'
import api from '../../../api/index'
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import List from '@mui/material/List'
import FormControl from '@mui/material/FormControl'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import SendIcon from '@mui/icons-material/Send';
import { useDispatch } from 'react-redux'
import { selectedBug} from '../../../redux/actions/bugActions'
import Comment from '../Comment/Comment';
import { selectedUser, setUsers } from '../../../redux/actions/userActions';
import { selectedProject, setProjects } from '../../../redux/actions/projectActions';
import { useUserAuth } from '../../../context/userAuthContext'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { setComments } from '../../../redux/actions/commentActions'

const bugHasComments=(bug)=>{
    if(bug.comments){
        if(bug.comments.length>0){
            return true
        }
    }
    return false 
}
const checkifCurrentBugIsFilled=(obj)=>{
    for(var prop in obj) {
        if(obj.hasOwnProperty(prop))
            return true;
    }
    return false;
}
const checkIfUserCanMakeComments=(user,bug)=>{
    if(user){
        if(bug){
            if(user.role==='admin'){
                return true
            }
            else if(bug.assignedTo){
                const userIDs = bug.assignedTo.map(user=>user._id)
                    if(userIDs.includes(user._id)){
                        return true
                    }
            }
        }
    }
    return false
}
const AlwaysScrollToBottom = () => {
    const elementRef = useRef();
    useEffect(() => elementRef.current.scrollIntoView());
    return <div id='bottom' ref={elementRef} />;
  };

  const scrollToBottom = () => {
    const section = document.querySelector( '#bottom' );
    if(section){
        section.scrollIntoView( { behavior: 'smooth', block: 'start' } );
    }
  };
const BugComments = () => {
    const {user,logOut,getSignInMethods} = useUserAuth()
    const users =useSelector((state)=>state.allUsers.users)
    const bug =useSelector((state)=>state.currentBug)
    const comments = useSelector((state)=>state.currentBugComments)
    //console.log(comments)
    useEffect(()=>{
        const findUserWithUID=(user,users)=>{
            if(user){
            for(let i=0;i<users.length;i++){
                if(users[i].uid==user.uid){
                  dispatch(selectedUser(users[i]))
                  return ''
                }
              }
            }
          }
          findUserWithUID(user,users)
    },[bug])
    const currentUser =useSelector((state)=>state.currentUser)
    
    const currentProject = useSelector((state)=>state.project)
    const isThereACurrentBug=checkifCurrentBugIsFilled(bug)
    const hasComments=bugHasComments(bug)
    const dispatch=useDispatch()
    const canUserMakeCommentsOnThisBug=checkIfUserCanMakeComments(currentUser,bug)
    const [chatInput,setChatInput]= useState({
        text:'',
        input:'',
    })
    const handleChange=(e)=>{
        const inputFieldValue = e.target.value;
        const inputFieldName =e.target.id||e.target.name//target name for the bugs select
        //if name is start or deadline change format to string
        const newInputValue = {...chatInput,[inputFieldName]:inputFieldValue}
        setChatInput(newInputValue);
    }

    const sendComment=async(e)=>{
        e.preventDefault()
        if(chatInput.text!==''){
            const newComment = {...chatInput}
            newComment.creator=currentUser._id
            newComment.bugID=bug._id
            //bug projectID property is a project object so get id
            newComment.projectID=currentProject._id
            const commentTime =new Date(Date.now())
            //comment was uploading future time as in instead of 'a few seconds ago', 
            //I would get in a few seconds so i subtracted some time
            newComment.date=commentTime.getTime()-40000
            await api.comments.createComment(newComment)
            const newBug = await api.bugs.fetchBug(bug._id)
            const newProject = await api.projects.fetchProject(currentProject._id)
            const updatedProjects = await api.projects.fetchProjects()
            dispatch(selectedBug(newBug))
            const updatedComments = await api.comments.fetchBugComments(bug._id)
            
            dispatch(setComments(updatedComments))
            dispatch(selectedProject(newProject))
            dispatch(setProjects(updatedProjects))
            setChatInput({
                text:'',
                input:'',
            })
            const updatedUsers =await api.users.fetchUsers()
            dispatch(setUsers(updatedUsers))
        }
    }
    
    useEffect(()=>{
    },[bug])
  return (
    <>
    {isThereACurrentBug?
    <Paper elevation={5} sx={{minWidth:450,gridArea:'comments', justifyContent:'center',width:'98%',}}>
            <Box p={3}>
                <Button onClick={scrollToBottom}><ArrowDownwardIcon/></Button>
                <Divider sx={{paddingTop:2,}}/>
                <Grid 
                sx={{
                    overflow: "hidden",
                    overflowY: "scroll",
                    height:300,
                }}>
                     <Grid item>
                        <List>
                            {hasComments?
                            <>
                            <div>{comments.map((comment)=>(
                                    <div key={comment._id}>
                                        <Comment comment={comment}/>
                                    </div>
                                ))}
                            </div><AlwaysScrollToBottom />
                            </>
                                :<></>
                            }
                        </List>
                     </Grid>
                    {canUserMakeCommentsOnThisBug?
                    <>
                        <Box
                                component="form"
                                sx={{display:'flex',alignItems:'center',
                                    justifyContent:'start',

                                }}
                                onSubmit={sendComment}
                                noValidate
                                autoComplete="off"
                                >
                                <FormControl >
                                    <TextField 
                                        id='text'
                                        value={chatInput.text}
                                        label='Type your message'
                                        variant="filled" 
                                        onChange={handleChange}
                                        sx={{width:500,}}
                                    />
                                </FormControl>
                                <Grid xs={4} item>
                                    <IconButton
                                    aria-label='send'
                                    color='primary'
                                    type='submit'>
                                        <SendIcon/>
                                    </IconButton>
                                </Grid>
                        </Box> 
                    </>                      
                        :
                    <></>
                     }
                </Grid>
            </Box>
        </Paper>:
        <></>
    }
    </>
  )
}

export default BugComments