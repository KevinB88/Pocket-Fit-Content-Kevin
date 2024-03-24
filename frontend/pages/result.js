import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Head from 'next/head';
import styles from "../css/results.module.css";

export default function Result() {
    const [images, setImages] = useState([]);
    const router = useRouter();

    useEffect(() => {
        async function fetchImages() {
            try {
                const response = await axios.get('http://127.0.0.1:5000/get-images');
                setImages(response.data);
            } catch (error) {
                console.error('Error loading images:', error);
            }
        }

        fetchImages();
    }, []);

    // Split the images array into two parts
    const headerImages = images.slice(0, 7); // Get the last 7 images
    
    return (
        <>
            <Head>
                <title>Live Camera Feed</title>
                <meta charset="UTF-8" />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
                <link href="https://fonts.googleapis.com/css2?family=Josefin+Sans:wght@100..700&display=swap" rel="stylesheet" />
            </Head>
            <div className={styles.resultBox}>
            <div className={styles.headerContainer}>
                <div className={styles.headerBanner}>
                    {headerImages.map((image, index) => (
                        <img className={styles.headerImage} key={index} src={`http://127.0.0.1:5000/images/${image}`} alt="Image" />
                    ))}
                </div>
            </div>
                <div className={styles.imageBox}>
                    <div className={styles.imageItem}></div>
                    <div className={styles.imageItem}></div>
                    <div className={styles.imageItem}></div>
                </div>
                <button onClick={() => router.push('/')}>Go back</button>
            </div>
        </>
    );
}