export const metadata = {
  title: 'Admin - Drivly AI',
  description: 'Admin portal for Drivly AI',
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
