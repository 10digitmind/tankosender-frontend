// src/redux/userSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { createUser,getSub,loginUser,getCurrentUser,getSmtp,createSmtp,connectSmtp,testSmtp,deleteSmtp,createEmailJob,getEmaailJob,deleteJob,updateJob ,StartJob} from "../redux/Asyncthunk";





const userSlice = createSlice({
  name: 'user',
  initialState: {
    user: null,
    token: null,
    loading: false,
    error: null,
    smtp:[],
    emailJob:[],
    success:null,
    subscription:[]
  },
  reducers: {
    login: (state, action) => {
       state.user = action.payload;
    },
    logout: (state) => {
     state.user = null;
      state.token = null;
    },
  },

  extraReducers:(builder)=> {
    builder
// create user
        .addCase(createUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(createUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

       // login user 
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.token = action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
//get user profile

       .addCase(getCurrentUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.token = action.payload.token;
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      //get smtp

       .addCase(getSmtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSmtp.fulfilled, (state, action) => {
        state.loading = false;
        state.smtp = action.payload;
        
      })
      .addCase(getSmtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })


      //create smtp

       .addCase(createSmtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSmtp.fulfilled, (state, action) => {
        state.loading = false;
        state.smtp = [action.payload];
        
      })
      .addCase(createSmtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })


      //connect smtp

       .addCase(connectSmtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(connectSmtp.fulfilled, (state, action) => {
        state.loading = false;
       state.smtp = [action.payload];
 
      })
      .addCase(connectSmtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

       //test smtp

       .addCase(testSmtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(testSmtp.fulfilled, (state, action) => {
        state.loading = false;
       state.success = action.payload;
 
      })
      .addCase(testSmtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

       //delete smtp

       .addCase(deleteSmtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteSmtp.fulfilled, (state, action) => {
        state.loading = false;
       state.success = action.payload;
 
      })
      .addCase(deleteSmtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

//create job
      .addCase(createEmailJob.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createEmailJob.fulfilled, (state, action) => {
        state.loading = false;
       state.emailJob = action.payload;
 
      })
      .addCase(createEmailJob.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })


      //get job
      .addCase(getEmaailJob.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getEmaailJob.fulfilled, (state, action) => {
        state.loading = false;
       state.emailJob = action.payload;
 
      })
      .addCase(getEmaailJob.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })


         //delete job
      .addCase(deleteJob.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteJob.fulfilled, (state, action) => {
        state.loading = false;
   state.success = action.payload;
 
      })
      .addCase(deleteJob.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })


       //edit job
      .addCase(updateJob.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateJob.fulfilled, (state, action) => {
        state.loading = false;
   state.emailJob = action.payload;
 
      })
      .addCase(updateJob.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })


       //start job
      .addCase(StartJob.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(StartJob.fulfilled, (state, action) => {
        state.loading = false;
   state.success = action.payload;
 
      })
      .addCase(StartJob.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })


      // get sub
      .addCase(getSub.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSub.fulfilled, (state, action) => {
        state.loading = false;
   state.subscription = action.payload;
 
      })
      .addCase(getSub.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
    }
});



export const { logout } = userSlice.actions;
export default userSlice.reducer;
