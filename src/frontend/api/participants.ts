export type CreateParticipantResponse = {
  id: string;
  nickname: string;
};

export async function createParticipant(
  nickname: string
): Promise<CreateParticipantResponse> {
  const response = await fetch("/api/participants", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ nickname }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }

  return data;
}
