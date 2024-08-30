import NotFoundImg from "../../assets/imgs/404.webp";

export default function NotFound() {
  return (
    <section className="flex flex-col justify-center mt-24 items-center py-5">
      <img src={NotFoundImg} alt="404 Not Found" style={{ width: "80vw", maxWidth: "60rem" }} />
      <h2 className="font-medium text-center text-teal-700 mt-16 text-3xl">Couldn't find the page you're looking for :(</h2>
    </section>
  );
}

