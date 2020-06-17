import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import firebase from '../firebase';

const firestore = firebase.firestore();

const Home = () => {
  const [links, setLinks] = useState([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    firestore
      .collection('links')
      .orderBy('createdAt', 'desc')
      .onSnapshot((querySnapshot) => {
        const res = querySnapshot.docs.map((snap) => {
          const data = snap.data();
          return {
            link: data.link,
            createdAt: data.createdAt.toDate()
          };
        });
        setLinks(res);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input) {
      alert('input kosong');
      return;
    }
    firestore.collection('links').add({
      link: input,
      createdAt: new Date()
    });
  };

  return (
    <div id="app">
      <Head>
        <title>Nitip Link gan</title>
      </Head>

      <div id="main">
        {links.map((data) => (
          <div key={data.createdAt.toString()}>
            <textarea rows="1" cols="50" wrap="off" disabled value={data.link} />
            <button onClick={() => navigator.clipboard.writeText(data.link)}>Copy</button>
            <br />
            <small>{data.createdAt.toString()}</small>
            <br />
            <br />
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        <input type="text" value={input} onChange={(e) => setInput(e.target.value)} />
        <button type="submit">Submit</button>
      </form>

      <style jsx>{`
        #app {
          display: flex;
        }
        textarea {
          resize: none;
        }
        #main {
          margin-right: 20px;
        }
      `}</style>
    </div>
  );
};

export default Home;
