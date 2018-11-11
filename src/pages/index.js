import React from 'react'
import Menu from '../components/Menu'

import Layout from '../components/layout'
import Image from '../components/image'

const IndexPage = () => (
  <Layout>
    <Menu />
    <h1>Recent articles</h1>
    <p>Some of the technical concepts solved on mytoori.com</p>
  </Layout>
)

export default IndexPage
