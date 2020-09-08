import React, { useState } from 'react';
import Head from 'next/head';
import Navbar from '../components/Navbar';

const Images = ({ images }) => {
  const [list, setList] = useState([])

  const handleImage = async (e) => {
    try {
      const file = e.target.files[0]
      const data = new FormData()
      data.append('file', file)
      data.append('upload_preset', 'NitipGambar')

      const res = await fetch('https://api.cloudinary.com/v1_1/ibam/image/upload', {
        method: 'POST',
        body: data
      })

      const resData = await res.json()
      alert('berhasil upload foto')
      setList(prev => [resData, ...prev])
    } catch (error) {
      console.log('error: ', error)
    }
  }

  return (
    <>
      <Navbar />
      <Head>
        <title>Images - Nitip Link</title>
      </Head>
      <div id="app">
        <div id="main">
          {list.map((image) => (
            <div key={image.asset_id}>
              <img src={image.secure_url} width="300" />
            </div>
          ))}
          {images.map((image) => (
            <div key={image.asset_id}>
              <img src={image.secure_url} width="300" />
            </div>
          ))}
        </div>

        <form>
          <label htmlFor="file">
            Image
            <input type="file" id="file" name="file" placeholder="upload image" onChange={handleImage} />
          </label>
        </form>

      </div>
      <style jsx>{`
        #app {
          display: flex;
        }

        #main {
          margin-right: 20px;
        }

        form {
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

export async function getServerSideProps() {
  const res = await fetch(`https://${process.env.CLOUDINARY_API_KEY}:${process.env.CLOUDINARY_API_SECRET}@api.cloudinary.com/v1_1/ibam/resources/image`)
  const data = await res.json()

  return {
    props: {
      images: data.resources || []
    }
  }
}

export default Images;
