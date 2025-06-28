import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const size = {
  width: 32,
  height: 32,
}
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'transparent',
        }}
      >
        <img 
          src="https://chunnthai.com.au/lotus-favicon-new.png" 
          width={32} 
          height={32}
          style={{
            objectFit: 'contain'
          }}
        />
      </div>
    ),
    {
      ...size,
    }
  )
}