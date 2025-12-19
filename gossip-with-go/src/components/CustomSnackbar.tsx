import { Alert, Snackbar } from "@mui/material";

interface CustomSnackbarProps {
    open: boolean;
    handleClose: () => void;
    message: string;
    severity: "success" | "error" | "warning" | "info";
}

export default function CustomSnackbar({
    open,
    handleClose,
    message,
    severity,
}: CustomSnackbarProps) {
    return (
        <Snackbar
            key={message} // to make sure the snackbar remounts when message changes
            open={open}
            autoHideDuration={2000}
            onClose={handleClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
            <Alert onClose={handleClose} severity={severity} sx={{ width: "100%" }}>
                {message}
            </Alert>
        </Snackbar>
    );
}