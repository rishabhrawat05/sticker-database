import React, { useEffect, useState } from 'react';
import UploadModal from '../components/UploadModal';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
  const [stickers, setStickers] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
      navigate('/');
    }
  }, [navigate]);

  useEffect(() => {
    const fetchStickers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/stickers');
        setStickers(response.data);
      } catch (error) {
        console.error('Error fetching stickers:', error);
      }
    };
    fetchStickers();
  }, []);

  const handleImageUpload = (newSticker) => {
    setStickers((prevStickers) => [...prevStickers, newSticker]);
  };

  return (
    <div style={styles.container}>
      <h1>Dashboard</h1>
      <button style={styles.uploadButton} onClick={() => setModalOpen(true)}>
        Upload New Image
      </button>
      <div style={styles.stickerContainer}>
        {stickers.length > 0 ? (
          stickers.map((sticker, index) => (
            <div key={index} style={styles.stickerCard}>
              <img
                src={`http://localhost:5000${sticker.image.url}`} 
                alt={sticker.metadata || `Image ${index + 1}`}
                style={styles.stickerImage}
              />
              <p>{sticker.description || 'No description available'}</p>
              <p>Amount: {sticker.amount || 'N/A'}</p>
              <p>Location Source: {sticker.locationSource || 'N/A'}</p>
              <p>Designer Name: {sticker.designerName || 'N/A'}</p>
              <p>Sticker Printer: {sticker.stickerPrinter || 'N/A'}</p>
              <p>
                Rating: Design - {sticker.rating?.design || 0}/5,<br/> Quality -{' '}
                {sticker.rating?.quality || 0}/5
              </p>
            </div>
          ))
        ) : (
          <p>No Stickers uploaded yet...</p>
        )}
      </div>
      {isModalOpen && (
        <UploadModal
          onClose={() => setModalOpen(false)}
          onSave={(newSticker) => {
            handleImageUpload(newSticker);
            setModalOpen(false);
          }}
        />
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    textAlign: 'center',
  },
  uploadButton: {
    padding: '10px 20px',
    backgroundColor: '#4CAF50',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  stickerContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '20px',
    marginTop: '20px',
    justifyContent: 'center',
  },
  stickerCard: {
    border: '1px solid #ccc',
    borderRadius: '8px',
    padding: '10px',
    textAlign: 'center',
    width: '200px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  stickerImage: {
    width: '100%',
    height: '150px',
    objectFit: 'cover',
    borderRadius: '8px',
  },
};

export default Dashboard;
