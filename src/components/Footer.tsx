export default function Footer() {
  return (
    <footer className="hidden md:flex fixed bottom-0 left-0 w-full h-16 bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-md items-center justify-center">
      <p className="text-center text-sm font-semibold">
        © {new Date().getFullYear()} YouTube Chrono. All Rights Reserved.  
        <br className="hidden md:block" /> 
        Made with ❤️ by Pulkit Garg
      </p>
    </footer>
  );
}
