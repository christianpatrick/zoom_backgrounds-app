module.exports = {
  siteMetadata: {
    title: `Zoom Backgrounds`,
    description: `Instantly preview backgrounds with your webcam and download your favorites!`,
    author: `@christianpatrick`,
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `zoom_backgrounds-app`,
        short_name: `zoom_backgrounds`,
        start_url: `/`,
        background_color: `#6396FF`,
        theme_color: `#6396FF`,
        display: `minimal-ui`,
      },
    },
  ],
}
