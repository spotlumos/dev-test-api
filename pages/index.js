import React, { useMemo, useCallback, useState, useEffect } from 'react';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import { useDropzone } from 'react-dropzone';
import { Button } from 'reactstrap';
import axios from 'axios';

const baseStyle = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '20px',
  borderWidth: 2,
  borderRadius: 2,
  borderColor: '#eeeeee',
  borderStyle: 'dashed',
  backgroundColor: '#fafafa',
  color: '#bdbdbd',
  outline: 'none',
  transition: 'border .24s ease-in-out',
};

const focusedStyle = {
  borderColor: '#2196f3',
};

const acceptStyle = {
  borderColor: '#00e676',
};

const rejectStyle = {
  borderColor: '#ff1744',
};

const thumbsContainer = {
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  marginTop: 16,
};

const thumb = {
  display: 'inline-flex',
  borderRadius: 2,
  border: '1px solid #eaeaea',
  marginBottom: 8,
  marginRight: 8,
  width: 100,
  height: 100,
  padding: 4,
  boxSizing: 'border-box',
};

const thumbInner = {
  display: 'flex',
  minWidth: 0,
  overflow: 'hidden',
};

const img = {
  display: 'block',
  width: 'auto',
  height: '100%',
};

export default function Home() {
  const [files, setFiles] = useState([]);
  const onDrop = useCallback(async (acceptedFiles) => {
    setFiles(
      acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      )
    );
  }, []);
  const onSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    files.forEach((file, index) => {
      formData.append(`file ${index}`, file);
    });
    const { data } = await axios.post('/api/file-upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log(data);
  };
  const { getRootProps, getInputProps, isFocused, isDragAccept, isDragReject } =
    useDropzone({ accept: { 'image/*': [] }, onDrop });

  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isFocused ? focusedStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
    }),
    [isFocused, isDragAccept, isDragReject]
  );

  const thumbs = files.map((file) => (
    <div style={thumb} key={file.name}>
      <div style={thumbInner}>
        <img
          src={file.preview}
          style={img}
          // Revoke data uri after image is loaded
          onLoad={() => {
            URL.revokeObjectURL(file.preview);
          }}
        />
      </div>
    </div>
  ));

  useEffect(() => {
    return () => files.forEach((file) => URL.revokeObjectURL(file.preview));
  }, []);

  return (
    <div className={styles.container}>
      <Head>
        <title>LUMOS Code Interview</title>
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Hello!</h1>
        <h2 className="mt-2">Upload your files here</h2>

        <div className="container mt-5 mb-3">
          <div {...getRootProps({ style })}>
            <input {...getInputProps()} />
            <p>Drag 'n' drop some files here, or click to select files</p>
          </div>
          <aside style={thumbsContainer}>{thumbs}</aside>
        </div>
        <Button onClick={onSubmit}>Submit</Button>

        <div className={styles.grid}></div>
      </main>

      <footer className={styles.footer}>
        Created by&nbsp;<b>Lumos</b>&nbsp;⚡️
      </footer>
    </div>
  );
}
