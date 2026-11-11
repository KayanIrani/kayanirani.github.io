import "./DiaryUI.css";
import { useBookStore } from "../../../store/store.js";
const frontBlankPages = Array(30).fill("backCover");
const backBlankPages = Array(30).fill("backCover");
// console.log(frontBlankPages)
const pictures = [
  ...frontBlankPages,
  "DSC00680",
  "DSC00933",
  "DSC00966",
  "DSC00983",
  "DSC01011",
  "DSC01040",
  "DSC01064",
  "DSC01071",
  "DSC01103",
  "DSC01145",
  "DSC01420",
  "DSC01461",
  "DSC01489",
  "DSC02031",
  "DSC02064",
  "DSC02069",
  ...backBlankPages,
];

export const pages = [
  {
    front: "book-cover",
    back: pictures[0],
  },
];
for (let i = 1; i < pictures.length - 1; i += 2) {
  pages.push({
    front: pictures[i % pictures.length],
    back: pictures[(i + 1) % pictures.length],
  });
}

pages.push({
  front: pictures[pictures.length - 1],
  back: "book-back",
});

// console.log(pages)

export const UI = () => {
  const page = useBookStore((state) => state.page);
  const setPage = useBookStore((state) => state.setPage);

  return (
    <>
        <main className="diary-ui">
        <a
            className="diary-logo-link"
            href="https://lessons.Kayansensei.dev/courses/react-three-fiber"
        >
            <img className="diary-logo" src="/images/wawasensei-white.png" alt="" />
        </a>

        <div className="diary-nav">
            <div className="diary-nav-inner">
            {[...pages].map((singlePage, index) =>
                singlePage.front !== "backCover" ? (
                <button
                    key={index}
                    className={`diary-btn ${index === page ? "active" : ""}`}
                    onClick={() => setPage(index)}
                >
                    {index === 0 ? "Cover" : `Page ${index}`}
                </button>
                ) : null
            )}

            <button
                className={`diary-btn ${page === pages.length ? "active" : ""}`}
                onClick={() => setPage(pages.length)}
            >
                Back Cover
            </button>
            </div>
        </div>
        
        </main>
    </>
  );
};


