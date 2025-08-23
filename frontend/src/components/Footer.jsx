const Footer = () => {
  return (
    <footer className="footer bg-black">
  <aside>
    <img src="./logo-notezy.png" alt="Notezy Logo" width={200} />
    <p className="font-bold">
      Crezon LLC.
      <br />
      Providing reliable tech since 2025 ⚙️
    </p>
    <p>Copyright © {new Date().getFullYear()} - All right reserved</p>
  </aside>
</footer>
  )
}

export default Footer;