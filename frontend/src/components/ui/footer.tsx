export default function Footer() {
  return (
    <footer className="w-full bg-[#F2F7FC] border-t-[1px] border-t-dark/10">
      <div className="items-center md:space-y-0 justify-center px-8 py-6 md:flex space-y-8">
        <div>
          <div className="flex items-center mb-6">
            <img src="/logo-iom.svg" alt="IOM-ITB Logo" className="w-full" />
          </div>

          <div className="flex flex-col">
            <p className="text-primary">
              Kota Bandung, Coblong Sekretariat IOM-ITB
            </p>
            <p className="text-primary">
              Gedung Kampus Center Timur ITB Lantai 2
            </p>
            <p className="text-primary">
              Jl. Ganesha No. 10 Kec. Coblong 40132.
            </p>
          </div>
        </div>
        <div className="flex flex-col">
          <h4 className="text-primary mb-2 font-bold">KONTAK</h4>
          <a
            href="mailto:sekretariat.iom.itb@gmail.com"
            className="text-primary"
          >
            sekretariat.iom.itb@gmail.com
          </a>
          <p className="text-primary">+62 856-2465-4990</p>
          <div className="mt-2 flex space-x-3">
            <a href="#" className="text-primary">
              <img src="/ig.svg" alt="Facebook" className="w-8" />
            </a>
            <a href="#" className="text-primary">
              <img src="/fb.svg" alt="Instagram" className="w-8" />
            </a>
            <a href="#" className="text-primary">
              <img src="/twitter.svg" alt="Twitter" className="w-8" />
            </a>
            <a href="#" className="text-primary">
              <img src="/line.svg" alt="Twitter" className="w-8" />
            </a>
            <a href="#" className="text-primary">
              <img src="/yt.svg" alt="Twitter" className="w-8" />
            </a>

          </div>
        </div>
      </div>
    </footer>
  );
}
