export const randomRotation = () => {
  const rotations = [-4, -2, 0, 2, 4];
  return rotations[Math.floor(Math.random() * rotations.length)];
};

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  });
};
