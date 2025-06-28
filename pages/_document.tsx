import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Aggressive inline style to override webkit-text-fill-color on mobile */}
        <style dangerouslySetInnerHTML={{ __html: `
          @media (max-width: 768px) {
            /* Nuclear option - override ALL webkit-text-fill-color on mobile */
            * {
              -webkit-text-fill-color: unset !important;
            }
            
            /* Target logo SVG specifically */
            .logo-container svg,
            .logo-container svg *,
            svg[data-mobile="true"],
            svg[data-mobile="true"] * {
              -webkit-text-fill-color: unset !important;
            }
            
            /* Force path elements to have black fill */
            .logo-container svg path,
            svg[data-mobile="true"] path {
              fill: #2C2416 !important;
              -webkit-text-fill-color: unset !important;
              color: #2C2416 !important;
            }
            
            /* Force text elements to have black fill */
            .logo-container svg text,
            svg[data-mobile="true"] text {
              fill: #000000 !important;
              -webkit-text-fill-color: #000000 !important;
              color: #000000 !important;
            }
          }
        `}} />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}