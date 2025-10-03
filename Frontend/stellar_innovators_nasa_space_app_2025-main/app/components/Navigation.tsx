'use client';
import { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import CloseIcon from '@mui/icons-material/Close';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { Divider, Card, CardContent, CardActionArea } from '@mui/material';

const Navigation = () => {
  const [showAboutDialog, setShowAboutDialog] = useState(false);

  const toggleAboutDialog = () => {
    setShowAboutDialog(!showAboutDialog);
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: 'rgba(255, 255, 255, 1)' }}>
      <Toolbar className="flex justify-between items-center px-4">
        <div className="flex items-center space-x-3">
          <div className='p-3'>
            <Typography variant="h4" className="font-bold tracking-tight text-gray-900 rounded">
              LumiLess
              <Typography variant="caption">
                by Stellar Innovators DIU
              </Typography>
            </Typography>
            <Typography variant="caption" className="bg-blue-600 text-white p-1 rounded">
              NASA Space Apps Challenge
            </Typography>
          </div>
        </div>
        <Button
          variant="contained"
          startIcon={<InfoOutlinedIcon />}
          className="hover:bg-blue-700"
          onClick={toggleAboutDialog}
          sx={{ backgroundColor: 'rgba(59, 130, 246, 1)' }}
        >
          About
        </Button>
      </Toolbar>

      <Dialog
        open={showAboutDialog}
        onClose={toggleAboutDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          className: "bg-gray-800 text-white rounded-lg",
        }}
      >
        <DialogTitle className="flex justify-between items-center">
          <span className="text-xl font-bold">About Stellar Innovators DIU</span>
          <IconButton onClick={toggleAboutDialog} aria-label="close" size="large" color='error'>
            <CloseIcon className="text-red-400" />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers className="space-y-4">
          <div>
            <Typography variant="subtitle1" className="mb-2 font-medium text-gray-500">Our Mission</Typography>
            <Typography variant="body2" className="text-gray-900">
              <b>LumiLess</b> is dedicated to addressing light pollution through innovative data visualization and analytics.
              Our mission is to raise awareness about the impact of light pollution on our environment and provide actionable
              insights for communities and policymakers.
            </Typography>
          </div>
          <div>
            <Typography variant="subtitle1" className="mb-2 font-medium text-gray-500">The Team</Typography>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="bg-white rounded shadow">
                <CardActionArea>
                  <CardContent>
                    <Typography className="font-semibold text-gray-900">MD. Rasel Islam</Typography>
                    <Typography variant="caption" className="text-gray-500">Team Leader | Researcher</Typography>
                    <Divider className="my-2 border-gray-200" />
                    <a href="mailto:raselislam07575@gmail.com" className="text-blue-600 hover:underline text-sm" target='_blank'>raselislam07575@gmail.com</a>
                  </CardContent>
                </CardActionArea>
              </Card>
              <Card className="bg-white rounded shadow">
                <CardActionArea>
                  <CardContent>
                    <Typography className="font-semibold text-gray-900">Muhammad Iktear</Typography>
                    <Typography variant="caption" className="text-gray-500">Backend Developer</Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
              <Card className="bg-white rounded shadow">
                <CardActionArea>
                  <CardContent>
                    <Typography className="font-semibold text-gray-900">Shihab Shariar</Typography>
                    <Typography variant="caption" className="text-gray-500">Backend Developer</Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
              <Card className="bg-white rounded shadow">
                <CardActionArea>
                  <CardContent>
                    <Typography className="font-semibold text-gray-900">Maheer Alam</Typography>
                    <Typography variant="caption" className="text-gray-500">UI-UX Developer</Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
              <Card className="bg-white rounded shadow">
                <CardActionArea>
                  <CardContent>
                    <Typography className="font-semibold text-gray-900">Fardin Kamal</Typography>
                    <Typography variant="caption" className="text-gray-500">Frontend Developer</Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
              <Card className="bg-white rounded shadow">
                <CardActionArea>
                  <CardContent>
                    <Typography className="font-semibold text-gray-900">Sumaiya Akter</Typography>
                    <Typography variant="caption" className="text-gray-500">Researcher</Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </div>
          </div>
          <div>
            <Typography variant="subtitle1" className="text-gray-500 mb-2 font-medium">NASA Space Apps Challenge 2025</Typography>
            <Typography variant="body2" className="text-gray-900">
              This project was developed for the NASA Space Apps Challenge 2025, focusing on visualizing
              and analyzing light pollution data using satellite imagery and machine learning techniques.
            </Typography>
          </div>
        </DialogContent>
        <DialogActions className="justify-center">
          <Button
            onClick={toggleAboutDialog}
            variant="contained"
            color="error"
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
          >
            Close
          </Button>
        </DialogActions>
      </Dialog >
    </AppBar >
  );
};

export default Navigation;