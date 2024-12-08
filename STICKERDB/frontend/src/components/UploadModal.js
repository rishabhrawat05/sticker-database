import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { getCroppedImg } from '../utils/cropImage';
import axios from 'axios';

const UploadModal = ({ onClose, onSave }) => {
  const [sticker, setSticker] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [locationSource, setLocationSource] = useState('');
  const [designerName, setDesignerName] = useState('');
  const [stickerPrinter, setStickerPrinter] = useState('');
  const [designRating, setDesignRating] = useState(0);
  const [qualityRating, setQualityRating] = useState(0);
  const [amount, setAmount] = useState(0);
  const [description, setDescription] = useState('');

  const handleFileChange = useCallback((event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setSticker(reader.result);
    };
    reader.readAsDataURL(file);
  }, []);

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleSave = async () => {
    try {
      if (sticker && croppedAreaPixels) {
        // Crop the image
        const croppedImage = await getCroppedImg(sticker, croppedAreaPixels);
        console.log('Cropped Image:', croppedImage); 
        
        const formData = new FormData();
        formData.append('image', croppedImage);
        formData.append('locationSource', locationSource);
        formData.append('designerName', designerName);
        formData.append('stickerPrinter', stickerPrinter);
        formData.append('rating[design]', designRating);
        formData.append('rating[quality]', qualityRating);
        formData.append('amount', amount);
        formData.append('description', description);
        const response = await axios.post('http://localhost:5000/stickers', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        console.log('Save Response:', response.data);
        onSave(response.data); 
        onClose();
      }
    } catch (error) {
      console.error('Error saving cropped image:', error);
    }
  };

  return (
    <div style={styles.modalContainer}>
      <h2>Upload</h2>
      {sticker && (
        <div style={styles.buttonContainer}>
          <button onClick={onClose}>Cancel</button>
          <button onClick={handleSave}>Save</button>
        </div>
      )}
      <div style={styles.cropContainer}>
        {!sticker ? (
          <input type="file" accept="image/*" onChange={handleFileChange} />
        ) : (
          <div style={styles.cropperWrapper}>
            <Cropper
              image={sticker}
              crop={crop}
              zoom={zoom}
              aspect={1}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          </div>
        )}
      </div>
      <input
        type="text"
        placeholder="Location Source"
        onChange={(e) => setLocationSource(e.target.value)}
      />
      <input
        type="number"
        placeholder="Amount"
        onChange={(e) => setAmount(e.target.value)}
      />
      <input
        type="text"
        placeholder="Designer Name"
        onChange={(e) => setDesignerName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Sticker Printer"
        onChange={(e) => setStickerPrinter(e.target.value)}
      />
      <input
        type="number"
        placeholder="Design Rating"
        onChange={(e) => setDesignRating(e.target.value)}
      />
      <input
        type="number"
        placeholder="Quality Rating"
        onChange={(e) => setQualityRating(e.target.value)}
      />
      <input
        type="text"
        placeholder="Description"
        onChange={(e) => setDescription(e.target.value)}
      />
    </div>
  );
};

export default UploadModal;

const styles = {
  modalContainer: {
    padding: '20px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
    maxWidth: '600px',
    position: 'absolute',
    top: '60%',
    left: '50%',
    transform: 'translate(-50%,-50%)',
  },
  cropContainer: {
    position: 'relative',
    width: '100%',
    height: '300px',
    background: '#f0f0f0',
    overflow: 'hidden',
    borderRadius: '8px',
  },
  cropperWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  buttonContainer: {
    marginTop: '20px',
    display: 'flex',
    justifyContent: 'space-between',
    zIndex: 100,
  },
};
