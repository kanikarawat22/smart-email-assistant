import './App.css';
import React, { useState } from 'react';
import axios from 'axios';
import { 
    Container, TextField, Typography , Box, 
    FormControl, Select, MenuItem, InputLabel, 
    CircularProgress, Button 
} from '@mui/material';

// The URL for your Spring Boot API
const API_URL = 'http://localhost:8080/api/email/generate'; 

function App() {
    const [emailContent, setEmailContent] = useState('');
    const [tone, setTone] = useState('');
    const [generatedReply, setGeneratedReply] = useState('');
    // 👇 FIX 1: Corrected initialization to boolean/null
    const [loading, setLoading] = useState(false); 
    const [error, setError] = useState(null);

    const handleSubmit = async () => {
        setLoading(true);
        setError(null);
        try{
          const response = await axios.post("http://localhost:8080/api/email/generate",{
            emailContent,
            tone
        });
        setGeneratedReply(typeof response.data === 'string' ? response.data : JSON.stringify(response.data))
        } catch (error) {
          setError('Failed to generated email reply. Please try again');
          console.error(error);
        } finally {
          setLoading(false);
        }
    };

    return (
        <Container maxWidth="md" sx={{py:4}}>
            <Typography variant='h3' component="h1" gutterBottom>
                Email Reply Generator
            </Typography>

            <Box sx={{mx: 3}}>
                <TextField
                    fullWidth
                    multiline
                    rows={6}
                    variant='outlined'
                    label='Original Email Content'
                    value={emailContent}
                    onChange={(e) => setEmailContent(e.target.value)}
                    sx={{mb:2}}
                />
                
                <FormControl fullWidth sx={{mb:2}}>
                    {/* 👇 Added unique id for InputLabel */}
                    <InputLabel id="tone-label">Tone (Optional)</InputLabel>
                    <Select 
                        labelId="tone-label" 
                        value={tone || ''}
                        label={"Tone (Optional)"}
                        onChange={(e) => setTone(e.target.value)}
                    >
                        <MenuItem value="">None</MenuItem>
                        <MenuItem value="professional">Professional</MenuItem>
                        <MenuItem value="casual">Casual</MenuItem>
                        <MenuItem value="friendly">Friendly</MenuItem>
                    </Select>
                </FormControl>

                <Button
                    // 👇 FIX 2: Corrected typo 'conatined' -> 'contained'
                    variant='contained' 
                    onClick={handleSubmit}
                    // The button should be disabled if no content OR loading
                    disabled={!emailContent.trim() || loading} 
                    fullWidth
                    size="large"
                    color='primary'
                >
                    {loading ? <CircularProgress size={24} color="inherit" /> : "Generate Reply"}
                </Button>
            </Box>

            {/* Display Error Message */}
            {error && (
                <Box sx={{mx: 3, my: 2, p: 2, border: '1px solid red'}}>
                    <Typography color='error'>{error}</Typography>
                </Box>
            )}


            {/* 👇 FIX 3: Corrected JSX conditional rendering syntax */}
            {generatedReply && (
                <Box sx={{mt:3, mx: 3}}>
                    <Typography variant='h6' gutterBottom>
                        Generated Reply:
                    </Typography>
                    <TextField
                        fullWidth
                        multiline
                        rows={6}
                        variant='outlined'
                        value={generatedReply}
                        inputProps={{readOnly: true}}
                    />

                    <Button
                        variant='outlined'
                        sx={{ mt:2}}
                        onClick={() => navigator.clipboard.writeText(generatedReply)}
                    >
                        Copy to Clipboard
                    </Button>
                </Box>
            )}
        </Container>
    );
}

export default App;