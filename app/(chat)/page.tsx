import { Chat } from '@/components/chat';
import { generateUUID } from '@/lib/utils';

export default async function Page() {
  const id = generateUUID();

  const initialMessages = [
    {
      "id": "1",
      "role": "user",
      "content": "**Hello!** How are you today?"
    },
    {
      "id": "2",
      "role": "assistant",
      "content": "I'm doing great! Here's a code snippet:\n\n```javascript\nconsole.log('Hello, world!');\n```"
    },
    {
      "id": "3",
      "role": "user",
      "content": "Can you create a table?\n\n| Name  | Age |\n|-------|-----|\n| John  | 25  |\n| Alice | 30  |"
    },
    {
      "id": "4",
      "role": "assistant",
      "content": "Sure! You can also use **bold**, *italic*, and `inline code`."
    },
    {
      "id": "5",
      "role": "user",
      "content": "How about a list?\n\n- Item 1\n- Item 2\n  - Sub-item 2.1\n  - Sub-item 2.2"
    },
    {
      "id": "6",
      "role": "assistant",
      "content": "Yes! You can also use numbered lists:\n\n1. First item\n2. Second item\n3. Third item"
    },
    {
      "id": "7",
      "role": "user",
      "content": "Can you add a quote?\n\n> This is a blockquote."
    },
    {
      "id": "8",
      "role": "assistant",
      "content": "Of course! You can combine them too:\n\n> **Note:** _Markdown is very flexible!_"
    },
    {
      "id": "9",
      "role": "user",
      "content": "How about a link?\n\n[Click here](https://example.com) to visit a website."
    },
    {
      "id": "10",
      "role": "assistant",
      "content": "You can even add images:\n\n![Alt text](https://via.placeholder.com/150)"
    },
    {
      "id": "11",
      "role": "assistant",
      "content": "Here's a longer code snippet:\n\n```python\nimport requests\n\ndef fetch_data(url):\n    try:\n        response = requests.get(url)\n        response.raise_for_status()\n        data = response.json()\n        return data\n    except requests.exceptions.RequestException as e:\n        print(f'Error fetching data: {e}')\n        return None\n\nif __name__ == '__main__':\n    api_url = 'https://api.example.com/data'\n    result = fetch_data(api_url)\n    if result:\n        print('Data retrieved successfully:', result)\n    else:\n        print('Failed to retrieve data')\n```"
    }
  ];

  return (
    <Chat
      key={id}
      id={id}
      initialMessages={initialMessages}
    />
  );
}
