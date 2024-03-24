import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import styles from '../css/Home.module.css';

export default function Home() {
  const imgRef = useRef(null);
  const router = useRouter();
  const [message, setMessage] = useState('');
  const [showVideoFeed, setShowVideoFeed] = useState(false);
  const [images, setImages] = useState([]);
  const [modalImage, setModalImage] = useState('');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // MJPEG URL
    const videoStreamUrl = 'http://127.0.0.1:5000/video_feed';
    // Set the image source to the MJPEG URL
    if (imgRef.current) {
      imgRef.current.src = videoStreamUrl;
    }
  }, []);

  async function takeSnapshot() {
    try {
      await axios.post('http://127.0.0.1:5000/take_snapshot');
    } catch (error) {
      console.error('Error taking snapshot:', error);
      setMessage('Error taking snapshot.');
    }
  }

  async function loadImages() {
    try {
      const response = await axios.get('http://127.0.0.1:5000/get-images');
      setImages(response.data);
      router.push('/result');
    } catch (error) {
      console.error('Error loading images:', error);
    }
  }

  function openModal(image) {
    setModalImage(image);
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
  }

  return (
    <div>
      <div>
        <h1 className={styles.title}>Pocket <br /> Fit</h1>
      </div>
      <div className={styles['line-container']}>
        <div className={styles.lineitem1}></div>
        <div className={styles.titleline}>
          <u></u>
        </div>
      </div>
      <div className={styles.container}>
        {/* Use the traditional src attribute for MJPEG stream */}
        <img ref={imgRef} width="100%" height="100%" alt="Video Stream" style={{ display: showVideoFeed ? 'block' : 'none' }} />
        {message && <p>{message}</p>}
      </div>
      <div className={styles['buttons-container']}>
        <button className={styles.button} onClick={takeSnapshot} style={{ display: showVideoFeed ? 'inline' : 'none' }}>Take Snapshot</button>
        <button className={styles.button} onClick={() => setShowVideoFeed(true)} style={{ display: showVideoFeed ? 'none' : 'inline' }}>📷</button>
        <button className={styles.button} onClick={loadImages}>Load Image</button>
        <button className={styles.button} onClick={loadImages}>View Album</button>
      </div>
      <div id="imageContainer">
        {images.map((image, index) => (
          <img key={index} src={`/images/${image}`} width="100px" style={{ cursor: 'pointer' }} onClick={() => openModal(image)} />
        ))}
      </div>
      {showModal && (
        <div id="imageModal">
          <span onClick={closeModal} style={{ cursor: 'pointer' }}>&times; Close</span>
          <img id="modalContent" src={`/images/${modalImage}`} style={{ maxWidth: '100%' }} />
        </div>
      )}
    </div>
  );
}