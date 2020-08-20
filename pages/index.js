import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import firebase from '../firebase';
import Navbar from '../components/Navbar';

const firestore = firebase.firestore();

const Home = () => {
  const [links, setLinks] = useState([]);
  const [input, setInput] = useState('');
  const [lastVisible, setLastVisible] = useState({})

  useEffect(() => fetchData({}), []);

  const fetchData = (start) => {
    firestore
      .collection('links')
      .orderBy('createdAt', 'desc')
      .startAfter(start)
      .limit(3)
      .get().then((querySnapshot) => {
        let lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
        setLastVisible(lastVisible);

        const res = querySnapshot.docs.map((snap) => {
          const data = snap.data();
          return {
            link: data.link,
            createdAt: data.createdAt.toDate()
          };
        });

        setLinks(prev => res.concat(prev));
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
    }).then(() => {
      setInput('')
      setLastVisible({})
      setLinks([])
      alert('berhasil menambahkan data')
      fetchData({})
    })
  };

  return (
    <>
      <Navbar />
      <Head>
        <title>Text - Nitip Link</title>
      </Head>
      <div id="app">
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

        <div id="input-nav">
          <form onSubmit={handleSubmit}>
            <input type="text" value={input} onChange={(e) => setInput(e.target.value)} />
            <button type="submit">Submit</button>
          </form>
          <button onClick={() => fetchData(lastVisible)}>load more</button>
        </div>
      </div>

      <style jsx>{`
        #app {
          display: flex;
          flex-wrap: wrap;
          flex-direction: row;
        }

        textarea {
          resize: none;
        }

        #main {
          margin-right: 20px;
        }

        #input-nav, form {
          margin-bottom: 20px;
        }

        @media screen and (max-width: 800px) {
          #app {
            flex-direction: column-reverse;
          }
        }
      `}</style>
    </>
  );
};

export default Home;
