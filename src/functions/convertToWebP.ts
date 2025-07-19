export const convertToWebP = async (
  file: File,
  maxWidth: number = 720,
  maxHeight: number = 720,
  quality: number = 0.3
): Promise<Blob | null> => {
  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = (event: ProgressEvent<FileReader>) => {
      const img = new Image();
      img.src = event.target?.result as string;

      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          const scale = Math.min(maxWidth / width, maxHeight / height);
          width = Math.round(width * scale);
          height = Math.round(height * scale);
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) return resolve(null);

        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => resolve(blob),
          "image/webp",
          quality
        );
      };
    };
  });
};

export default convertToWebP;
