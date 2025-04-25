import React, { useState, useEffect } from 'react';
import {
    Container,
    Paper,
    TextField,
    Button,
    Typography,
    Box,
    List,
    ListItem,
    ListItemText,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField as MuiTextField,
    Grid,
    Alert
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useAuth } from '../../context/AuthContext';
import notesService from '../../services/notesService';

function Notes() {
    const { token, logout } = useAuth();
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [currentNote, setCurrentNote] = useState({ title: '', description: '' });
    const [editingNote, setEditingNote] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchNotes();
    }, [searchTerm, fromDate, toDate]);

    const fetchNotes = async () => {
        try {
            setError(null);
            console.log('Fetching notes with token:', token);
            const response = await notesService.getNotes(token, searchTerm, fromDate, toDate);
            console.log('Notes response:', response);
            setNotes(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching notes:', error);
            setError(error.response?.data?.message || 'Failed to fetch notes. Please check if the backend server is running.');
            setLoading(false);
        }
    };

    const handleCreateNote = async () => {
        try {
            setError(null);
            if (editingNote) {
                await notesService.updateNote(token, editingNote.id, currentNote);
            } else {
                await notesService.createNote(token, currentNote);
            }
            setOpenDialog(false);
            setCurrentNote({ title: '', description: '' });
            setEditingNote(null);
            fetchNotes();
        } catch (error) {
            console.error('Error saving note:', error);
            setError(error.response?.data?.message || 'Failed to save note');
        }
    };

    const handleDeleteNote = async (id) => {
        try {
            setError(null);
            await notesService.deleteNote(token, id);
            fetchNotes();
        } catch (error) {
            console.error('Error deleting note:', error);
            setError(error.response?.data?.message || 'Failed to delete note');
        }
    };

    const handleEditNote = (note) => {
        setCurrentNote({ title: note.title, description: note.description });
        setEditingNote(note);
        setOpenDialog(true);
    };

    return (
        <Container maxWidth="md">
            <Box sx={{ mt: 4, mb: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="h4">My Notes</Typography>
                    <Button variant="contained" onClick={() => setOpenDialog(true)}>
                        Create Note
                    </Button>
                </Box>

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                <Paper sx={{ p: 2, mb: 2 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                label="Search Notes"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DatePicker
                                    label="From Date"
                                    value={fromDate}
                                    onChange={setFromDate}
                                    renderInput={(params) => <MuiTextField {...params} fullWidth />}
                                />
                            </LocalizationProvider>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DatePicker
                                    label="To Date"
                                    value={toDate}
                                    onChange={setToDate}
                                    renderInput={(params) => <MuiTextField {...params} fullWidth />}
                                />
                            </LocalizationProvider>
                        </Grid>
                    </Grid>
                </Paper>

                {loading ? (
                    <Typography>Loading...</Typography>
                ) : notes.length === 0 ? (
                    <Typography>No notes found. Create your first note!</Typography>
                ) : (
                    <List>
                        {notes.map((note) => (
                            <Paper key={note.id} sx={{ mb: 2 }}>
                                <ListItem
                                    secondaryAction={
                                        <Box>
                                            <IconButton onClick={() => handleEditNote(note)}>
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton onClick={() => handleDeleteNote(note.id)}>
                                                <DeleteIcon />
                                            </IconButton>
                                        </Box>
                                    }
                                >
                                    <ListItemText
                                        primary={note.title}
                                        secondary={
                                            <>
                                                <Typography component="span" variant="body2">
                                                    {note.description}
                                                </Typography>
                                                <br />
                                                <Typography component="span" variant="caption" color="text.secondary">
                                                    {new Date(note.createdAt).toLocaleString()}
                                                </Typography>
                                            </>
                                        }
                                    />
                                </ListItem>
                            </Paper>
                        ))}
                    </List>
                )}
            </Box>

            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle>{editingNote ? 'Edit Note' : 'Create Note'}</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Title"
                        fullWidth
                        value={currentNote.title}
                        onChange={(e) => setCurrentNote({ ...currentNote, title: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Description"
                        fullWidth
                        multiline
                        rows={4}
                        value={currentNote.description}
                        onChange={(e) => setCurrentNote({ ...currentNote, description: e.target.value })}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                    <Button onClick={handleCreateNote} variant="contained">
                        {editingNote ? 'Update' : 'Create'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}

export default Notes;
