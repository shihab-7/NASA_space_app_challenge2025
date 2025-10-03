import CircularProgress from '@mui/material/CircularProgress';

const LoadingSpinner = () => {
    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-white/30 backdrop-blur-lg">
            <div className="flex flex-col items-center">
                <CircularProgress
                    size={64}
                    thickness={5}
                    sx={{
                        color: '#2563eb',
                    }}
                    variant="indeterminate"
                />
                <div className="mt-6 text-lg font-semibold text-sky-700 animate-pulse">
                    Loading data, please wait...
                </div>
            </div>
        </div>
    );
};

export default LoadingSpinner;
