import './App.css';
import React, { useState } from 'react';
import axios from 'axios';
import {
  TextField, Typography, Box,
  FormControl, Select, MenuItem,
  CircularProgress, Button
} from '@mui/material';

const API_URL = 'http://localhost:8080/api/email/generate';
const IMPROVE_API_URL = 'http://localhost:8080/api/email/improve';

function App() {

  const [emailContent, setEmailContent] = useState('');
  const [tone, setTone] = useState('');
  const [generatedReply, setGeneratedReply] = useState('');
  const [editedReply, setEditedReply] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(API_URL, {
        emailContent,
        tone
      });

      const result =
        typeof response.data === 'string'
          ? response.data
          : JSON.stringify(response.data);

      setGeneratedReply(result);
      setEditedReply(result);
      setIsEditing(false);

    } catch (err) {
      setError('Failed to generate email reply. Please try again');
    } finally {
      setLoading(false);
    }
  };

  const handleImprove = async (mode) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(IMPROVE_API_URL, {
        emailContent: generatedReply,
        tone,
        mode
      });

      const result =
        typeof response.data === 'string'
          ? response.data
          : JSON.stringify(response.data);

      setGeneratedReply(result);
      setEditedReply(result);
      setIsEditing(false);

    } catch (err) {
      setError('Failed to improve reply. Please try again');
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerateFromEdit = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(IMPROVE_API_URL, {
        emailContent: editedReply,
        tone,
        mode: "rewrite"
      });

      const result =
        typeof response.data === 'string'
          ? response.data
          : JSON.stringify(response.data);

      setGeneratedReply(result);
      setEditedReply(result);
      setIsEditing(false);

    } catch (err) {
      setError('Failed to regenerate edited reply');
    } finally {
      setLoading(false);
    }
  };

  const hasOutput = generatedReply && generatedReply.length > 0;

  return (
    <div className={`app-bg ${hasOutput ? "after" : "before"}`}>

      {/* ================= INPUT BOX ================= */}
      <Box className="app-container">

        <Typography className="title">
          Email Reply Generator
        </Typography>

        <Typography className="subtitle">
          Generate AI email replies
        </Typography>

        <TextField
          className="input-box"
          fullWidth
          label="Email Content"
          multiline
          rows={4}
          value={emailContent}
          onChange={(e) => setEmailContent(e.target.value)}
        />

        <FormControl fullWidth className="input-box">
          <Select
            value={tone}
            onChange={(e) => setTone(e.target.value)}
            displayEmpty
          >
            <MenuItem value="">Select Tone</MenuItem>
            <MenuItem value="formal">Formal</MenuItem>
            <MenuItem value="friendly">Friendly</MenuItem>
            <MenuItem value="professional">Professional</MenuItem>
          </Select>
        </FormControl>

        <Button
          className="generate-btn"
          variant="contained"
          fullWidth
          onClick={handleSubmit}
          disabled={!emailContent || loading}
        >
          Generate Reply
        </Button>

        {loading && (
          <Box className="loader">
            <CircularProgress />
          </Box>
        )}

        {error && <Box className="error">{error}</Box>}

      </Box>

      {/* ================= OUTPUT BOX ================= */}
      {hasOutput && (
        <Box className="output-container">

          <Typography variant="h6">
            Generated Reply
          </Typography>

          {!isEditing ? (
            <Typography sx={{ whiteSpace: "pre-line", mt: 1 }}>
              {generatedReply}
            </Typography>
          ) : (
            <TextField
              fullWidth
              multiline
              rows={6}
              value={editedReply}
              onChange={(e) => setEditedReply(e.target.value)}
              sx={{ mt: 1 }}
            />
          )}

          {!isEditing ? (
            <button
              className="copy-btn"
              onClick={() => setIsEditing(true)}
            >
              ✏️ Edit Reply
            </button>
          ) : (
            <div className="btn-row">

              <button onClick={() => setIsEditing(false)}>
                Save
              </button>

              <button onClick={handleRegenerateFromEdit}>
                🔁 Regenerate
              </button>

            </div>
          )}

          {!isEditing && (
            <div className="btn-row">

              <button onClick={() => handleImprove("short")}>
                Shorter
              </button>

              <button onClick={() => handleImprove("polite")}>
                Polite
              </button>

              <button onClick={() => handleImprove("formal")}>
                Formal
              </button>

            </div>
          )}

          {!isEditing && (
            <button
              className="copy-btn"
              onClick={() => navigator.clipboard.writeText(generatedReply)}
            >
              Copy Reply
            </button>
          )}

        </Box>
      )}

    </div>
  );
}

export default App;