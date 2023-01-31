import React, { useEffect } from 'react'
import Box from '@mui/material/Box';
import { useDispatch, useSelector } from 'react-redux'
import  Paper  from '@mui/material/Paper';
import BugComments from '../BugComments/BugComments';
import { removeSelectedBug } from '../../../redux/actions/bugActions';
import { Button, Typography } from '@mui/material';
import EditBugModal from '../EditBugModal/EditBugModal';
import { removeComments } from '../../../redux/actions/commentActions';

const checkBug=(bug)=>{
    if(bug._id){
        if(bug.assignedTo){
            return true
        }
    }
    else{
        return false
    }
}

const BugDashboard = () => {
    const bug =useSelector((state)=>state.currentBug)
    const isBugFilled = checkBug(bug)
    const dispatch=useDispatch()
    const clearCurrentBug=()=>{
        dispatch(removeSelectedBug())
        dispatch(removeComments())
    }
    useEffect(() => {
    },[bug]);
    return (
        <>
        <Box
            sx={{  
                minWidth:500,
                marginTop:{xs:'7%',sm:'7%',md:'7%',lg:'1%'},
                width:'96%',display:'flex',flexDirection:'column',
                gridTemplateAreas:{
                    xs:
                    `"info"
                    "bug"
                    "comments"
                    `
                    , 
                    sm:
                    `
                    "info"
                    "bug"
                    "comments"
                    `,
                    md:`
                    "info info"
                    "bug comments"
                    "bug comments"
                  `,
                },
                  gap:3,
                  padding:'2%',
                  textAlign:'center',
                  justifyContent:'center',
                  alignItems:'center',
        }}>
            <Paper sx ={{gridArea:'info',height:50,padding:'3%',width:{xs:'86%',sm:'94%',},display:'flex',justifyContent:'space-between',
                        alignItems:'center',marginTop:{xs:'7%',sm:'5%',md:'2%',lg:'0%'},}}>
                <Typography>
                    Selected Bug Info
                </Typography>
                {isBugFilled?<><Button variant ='contained' onClick={clearCurrentBug}>Clear Bug</Button></>:<></>}
            </Paper>
            {isBugFilled?
            <>
                    <Paper elevation={5} sx={{width:{xs:'86%',sm:'94%',},gridArea:'bug',padding:'2%'}}>
                        <EditBugModal/>
                        <Box
                            sx={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(5, 1fr)',
                                gap: 2,
                                gridTemplateRows: 'repeat(3, 1fr)',
                                gridTemplateAreas: `
                                "title status description description description"
                                "creator priority type . ."
                                "assigned assigned assigned assigned assigned"`,
                            }}
                            >
                            <Box sx={{ gridArea: 'title', display:'flex',flexDirection:'column' }}>
                                <Typography variant="subtitle1" gutterBottom>
                                    Title
                                </Typography>
                                <Typography variant="button" gutterBottom>
                                    {bug.title}
                                </Typography>
                            </Box>
                            <Box sx={{ gridArea: 'creator',  }}>
                            <Typography variant="subtitle1" gutterBottom>
                                    Creator
                                </Typography>
                                <Typography variant="button" gutterBottom>
                                    {bug.creator}
                                </Typography>
                            </Box>
                            <Box sx={{ gridArea: 'description',justifyContent:'start'}}>
                                <Typography variant="subtitle1" gutterBottom>
                                    Description
                                </Typography>
                                <Typography variant="button" gutterBottom>
                                    {bug.description}
                                </Typography>
                            </Box>
                            <Box sx={{ gridArea: 'status',  }}>
                                <Typography variant="subtitle1" gutterBottom>
                                    Status
                                </Typography>
                                <Typography variant="button" gutterBottom>
                                    {bug.status}
                                </Typography>
                            </Box>
                            <Box sx={{ gridArea: 'priority',  }}>
                                <Typography variant="subtitle1" gutterBottom>
                                    Priority
                                </Typography>
                                <Typography variant="button" gutterBottom>
                                    {bug.priority}
                                </Typography>
                            </Box>
                            {/* <Box sx={{ gridArea: 'type',  }}>
                                <Typography variant="subtitle1" gutterBottom>
                                    Type
                                </Typography>
                                <Typography variant="button" gutterBottom>
                                    {bug.type}
                                </Typography>
                            </Box> */}
                            <Box sx={{ gridArea: 'assigned',  }}>
                                <Typography variant="subtitle1" gutterBottom>Assigned Devs</Typography>
                                <div>
                                    {bug.assignedTo.map((member)=>
                                        <div key={member._id}>{member.email}</div>
                                    )}
                                </div>
                            </Box>
                        </Box>
                    </Paper>
                <BugComments/>
            </>
                :
                <></>}
        </Box>
    </>  
    )
}

export default BugDashboard