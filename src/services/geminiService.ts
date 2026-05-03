export async function analyzeRepository(repoName: string, description: string, readme: string) {
  const response = await fetch('/api/analyze', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ repoName, description, readme })
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || 'Failed to analyze repository');
  }

  return data;
}
