import React, { useState } from "react";
import Modal from "@material-ui/core/Modal";
import { makeStyles } from "@material-ui/core/styles";
import { Button } from "@material-ui/core";
import HomeIcon from "@material-ui/icons/Home";
import PersonIcon from "@material-ui/icons/Person";
import firebase from "firebase";
import { storage, db } from "../services/firebase";
import "./ImageUpload.css";

function getModalStyle() {
    const top = 50;
    const left = 50;

    return {
        top: `${top}%`,
        left: `${left}%`,
        transform: `translate(-${top}%, -${left}%`,
    };
}

const useStlyes = makeStyles((theme) => ({
    paper: {
        position: "absolute",
        width: 280,
        backgroundColor: theme.palette.background.paper,
        border: "2px solid #000",
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
}));

function ImageUpload({ username }) {
    const classes = useStlyes();
    const [modalStyle] = useState(getModalStyle);
    const [openUpload, setOpenUpload] = useState(false);
    const [image, setImage] = useState(null);
    const [progress, setProgress] = useState(0);
    const [caption, setCaption] = useState("");

    const handleChange = (e) => {
        if (e.target.files[0]) {
            setImage(e.target.files[0]);
            setOpenUpload(true);
        }
    };

    const handleUpload = () => {
        const uploadTask = storage.ref(`images/${image.name}`).put(image);

        // upload listener
        uploadTask.on(
            "state_changed",
            (snapshot) => {
                //progress	function ...
                const progress = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );
                setProgress(progress);
            },
            (error) => {
                // Error function ...
                console.log(error);
                alert(error.message);
            },
            () => {
                //complete function ...
                storage
                    .ref("images")
                    .child(image.name)
                    .getDownloadURL()
                    .then((url) => {
                        //post image inside db
                        db.collection("posts").add({
                            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                            caption: caption,
                            imageUrl: url,
                            username: username,
                        });

                        setOpenUpload(false);
                        setProgress(0);
                        setCaption("");
                        setImage(null);
                    });
            }
        );
    };

    return (
        <>
            <Modal
                open={openUpload}
                onClose={() => setOpenUpload(false)}
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
            >
                <div style={modalStyle} className={classes.paper}>
                    {image && (
                        <h5 style={{ color: "green" }}>{"./" + image.name}</h5>
                    )}
                    <progress
                        className="imageupload__progress"
                        value={progress}
                        max="100"
                    />
                    <div className="image_caption">
                        <input
                            type="text"
                            placeholder="Enter a Caption..."
                            onChange={(event) => setCaption(event.target.value)}
                            value={caption}
                        />

                        <Button
                            className="imageupload_button"
                            onClick={handleUpload}
                        >
                            UPLOAD
                        </Button>
                    </div>
                </div>
            </Modal>
            <div className="imageUpload">
                <HomeIcon className="home_icon" style={{ fontSize: 50 }} />
                <div className="add_section">
                    <label class="custom-file-upload">
                        <input type="file" onChange={handleChange} />+
                    </label>
                </div>
                <div className="panel_username">
                    <span>
                        <PersonIcon style={{ fontSize: 50 }} />
                        <h3>{username} </h3>
                    </span>
                </div>
            </div>
        </>
    );
}

export default ImageUpload;
