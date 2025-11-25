import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";



const API_URL =process.env.REACT_APP_API_URL 



export const createUser = createAsyncThunk(
  "auth/createUser",
  async ({ email, password }, thunkAPI) => {
    try {
      const res = await axios.post(`${API_URL}/register-user`, {
        email,
        password,
      });

      toast.success(
        "Registration successful. Please check your email to verify your account."
      );

    
      return res.data; // user + message
    } catch (error) {
      console.error("Axios error:", error.message);

      const message =
        error.response?.data?.message || error.message || "Registration failed";

      toast.error(message);

      return thunkAPI.rejectWithValue({ message });
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password }, thunkAPI) => {
    try {
      const res = await axios.post(`${API_URL}/login-user`, {
        email,
        password,
      });

      return res.data; // contains user + token
    } catch (error) {
      console.log(error)
      return thunkAPI.rejectWithValue(error.response?.data || "Login failed");
    }
  }
);

export const getCurrentUser = createAsyncThunk(
  "content/getCurrentUser",
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem("authToken"); // get token from localStorage

      const res = await axios.get(`${API_URL}/get-user-profile`, {
        headers: {
          Authorization: `Bearer ${token}`, // add token to header
        },
      });

      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch content"
      );
    }
  }
);

export const getSmtp = createAsyncThunk(
  "content/getSmtp",
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem("authToken"); // get token from localStorage

      const res = await axios.get(`${API_URL}/get-smtp`, {
        headers: {
          Authorization: `Bearer ${token}`, // add token to header
        },
      });

      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch content"
      );
    }
  }
);

export const createSmtp = createAsyncThunk(
  "smtp/createSmtp",
  async ({ label, host, port, username, password, secure }, thunkAPI) => {
    try {
      const token = localStorage.getItem("authToken");

      const res = await axios.post(
        `${API_URL}/create-smtp`,
        { label, host, port, username, password, secure },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
   

      return res.data.smtp; // return newly created smtp
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to create SMTP"
      );
    }
  }
);

// redux/Asyncthunk.js
export const connectSmtp = createAsyncThunk(
  "smtp/connect",
  async ({ smtpId }, thunkAPI) => {
    try {
      const token = localStorage.getItem("authToken");

      const res = await axios.post(
        `${API_URL}/connect-smtp`,
        { smtpId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      return res.data.smtp; // Should return updated SMTP object with connected status
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.error || "Failed to connect SMTP"
      );
    }
  }
);

// redux/Asyncthunk.js
export const testSmtp = createAsyncThunk(
  "smtp/testSmtp",
  async ({ smtpId, to }, thunkAPI) => {
    try {
      const token = localStorage.getItem("authToken");

      const res = await axios.post(
        `${API_URL}/test-smtp`,
        { smtpId,to },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      return res.data; // Should return updated SMTP object with connected status
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.error || "Failed to connect SMTP"
      );
    }
  }
);



export const deleteSmtp = createAsyncThunk(
  "smtp/deleteSmtp",
  async (id, thunkAPI) => {
    try {
      const token = localStorage.getItem("authToken");
      const res = await axios.delete(`${API_URL}/delete-smtp/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.error || "Failed to delete SMTP"
      );
    }
  }
);


export const createEmailJob = createAsyncThunk(
  "smtp/createEmailJob",
  async ({ recipients,
    from,
    subject,
    messageType,
    messageContent,
    interval }, thunkAPI) => {
    try {
      const token = localStorage.getItem("authToken");

      const res = await axios.post(
        `${API_URL}/create-job`,
        { recipients,
    from,
    subject,
    messageType,
    messageContent,
    interval },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
   

      return res.data.smtp; // return newly created smtp
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to create SMTP"
      );
    }
  }
);


export const getEmaailJob = createAsyncThunk(
  "content/getEmaailJob",
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem("authToken"); // get token from localStorage

      const res = await axios.get(`${API_URL}/get-job`, {
        headers: {
          Authorization: `Bearer ${token}`, // add token to header
        },
      });

      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch getEmaailJob"
      );
    }
  }
);

export const deleteJob = createAsyncThunk(
  "smtp/deleteJob",
  async (smtpId, thunkAPI) => {
    try {
      const token = localStorage.getItem("authToken");
      const res = await axios.delete(`${API_URL}/delete-job/${smtpId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.error || "Failed to delete job"
      );
    }
  }
);

export const updateJob = createAsyncThunk(
  "job/updateJob",
  async ({ id, data }, thunkAPI) => {
    try {
      const token = localStorage.getItem("authToken");

      const res = await axios.patch(
        `${API_URL}/edit-job/${id}`,
        data,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      return res.data.job;
    } catch (error) {
        console.log(error)
      return thunkAPI.rejectWithValue(
        error.response?.data?.error || "Failed to update job"
      );
    }
  }
);

export const StartJob = createAsyncThunk(
  "job/startJob",
  async ({ JobId }, thunkAPI) => {
    try {
      const token = localStorage.getItem("authToken");

      const res = await axios.post(
        `${API_URL}/start-job/${JobId}`,
        {}, // body is empty
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.error || "Failed to start job"
      );
    }
  }
);

export const getSub = createAsyncThunk(
  "content/getSub",
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem("authToken"); // get token from localStorage

      const res = await axios.get(`${API_URL}/get-sub`, {
        headers: {
          Authorization: `Bearer ${token}`, // add token to header
        },
      });

      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch getsub"
      );
    }
  }
);