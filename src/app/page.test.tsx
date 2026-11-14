import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import Home from "./page";

const sample = {
  model: "test-model",
  prediction: { code: "mel", name: "Melanoma", group: "malignant", confidence: 0.82 },
  uncertain: false,
  probabilities: [
    { code: "mel", name: "Melanoma", probability: 0.82 },
    { code: "nv", name: "Melanocytic nevi", probability: 0.1 },
    { code: "bkl", name: "Benign keratosis-like lesions", probability: 0.04 },
    { code: "bcc", name: "Basal cell carcinoma", probability: 0.02 },
    { code: "akiec", name: "Actinic keratoses / intraepithelial carcinoma", probability: 0.01 },
    { code: "vasc", name: "Vascular lesions", probability: 0.005 },
    { code: "df", name: "Dermatofibroma", probability: 0.005 },
  ],
  disclaimer: "Not a medical device.",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });
const png = () => new File(["fake"], "lesion.png", { type: "image/png" });
const fileInput = () => screen.getByLabelText("Dermoscopic image file");

beforeEach(() => {
  URL.createObjectURL = vi.fn(() => "blob:preview");
  URL.revokeObjectURL = vi.fn();
});
afterEach(() => vi.unstubAllGlobals());

describe("Home page", () => {
  it("shows the disclaimer and keeps Analyze disabled until a file is chosen", () => {
    render(<Home />);
    expect(screen.getByText(/not a medical device/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /analyze image/i })).toBeDisabled();
  });

  it("rejects a file that is not an image", async () => {
    const user = userEvent.setup({ applyAccept: false });
    render(<Home />);
    await user.upload(fileInput(), new File(["hello"], "notes.txt", { type: "text/plain" }));
    expect(await screen.findByRole("alert")).toHaveTextContent(/jpeg or png/i);
    expect(screen.getByRole("button", { name: /analyze image/i })).toBeDisabled();
  });

  it("sends the image and shows the class, the confidence and every probability", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => json(sample)));
    const user = userEvent.setup();
    render(<Home />);

    await user.upload(fileInput(), png());
    expect(screen.getByAltText("The selected lesion")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /analyze image/i }));

    expect(await screen.findByRole("heading", { name: "Melanoma", level: 3 })).toBeInTheDocument();
    expect(screen.getByText("82.0%", { selector: "strong" })).toBeInTheDocument();
    expect(screen.getByText("malignant")).toBeInTheDocument();
    expect(screen.getAllByRole("progressbar")).toHaveLength(7);
    expect(screen.queryByText(/uncertain result/i)).not.toBeInTheDocument();

    const [url, init] = vi.mocked(fetch).mock.calls[0];
    expect(String(url)).toMatch(/\/predict$/);
    expect((init?.body as FormData).get("file")).toBeInstanceOf(File);
  });

  it("flags an uncertain result", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => json({ ...sample, uncertain: true })));
    const user = userEvent.setup();
    render(<Home />);
    await user.upload(fileInput(), png());
    await user.click(screen.getByRole("button", { name: /analyze image/i }));
    expect(await screen.findByText(/uncertain result/i)).toBeInTheDocument();
  });

  it("explains when the server cannot be reached", async () => {
    vi.stubGlobal("fetch", vi.fn(() => Promise.reject(new TypeError("Failed to fetch"))));
    const user = userEvent.setup();
    render(<Home />);
    await user.upload(fileInput(), png());
    await user.click(screen.getByRole("button", { name: /analyze image/i }));
    expect(await screen.findByRole("alert")).toHaveTextContent(/could not reach the analysis server/i);
  });

  it("shows the error message sent by the server", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => json({ detail: "The file could not be read as an image." }, 400)));
    const user = userEvent.setup();
    render(<Home />);
    await user.upload(fileInput(), png());
    await user.click(screen.getByRole("button", { name: /analyze image/i }));
    expect(await screen.findByRole("alert")).toHaveTextContent("The file could not be read as an image.");
  });

  it("clears everything when the user starts over", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => json(sample)));
    const user = userEvent.setup();
    render(<Home />);
    await user.upload(fileInput(), png());
    await user.click(screen.getByRole("button", { name: /analyze image/i }));
    await screen.findByRole("heading", { name: "Melanoma", level: 3 });

    await user.click(screen.getByRole("button", { name: /start over/i }));
    expect(screen.queryByRole("heading", { name: "Melanoma", level: 3 })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: /analyze image/i })).toBeDisabled();
  });
});
