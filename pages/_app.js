import React from 'react'
import App from 'next/app'
import Router from 'next/router'
import Head from 'next/head';
import NProgress from 'nprogress'

Router.events.on('routeChangeStart', url => NProgress.start())
Router.events.on('routeChangeComplete', () => NProgress.done())
Router.events.on('routeChangeError', () => NProgress.done())

export default class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props;
    return (
      <>
        <Head>
          <link rel="stylesheet" type="text/css" href="/styles/nprogress.css" />
        </Head>
        <Component {...pageProps} />
      </>
    )
  }
}
