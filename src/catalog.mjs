// Prices are in MYR. Add a merchant-hosted payment link only when fulfilment is ready.
export const products = [
  {
    id: 'everyday-ai', category: 'ebooks', tier: 'Starter', title: 'Everyday AI',
    description: 'A friendly first guide to making AI useful in your everyday life.',
    price: 0, label: 'Free ebook', detail: 'Downloadable PDF · 5 pages',
    intro: 'Bring one small task you keep putting off. This five-page guide walks you through asking for a first draft, making it sound like you, and checking the result.',
    topics: ['Write a clear request in four short lines', 'Turn a rough note into a ready-to-send message', 'Check a draft against your original details'],
    excerptTitle: 'Try the four-line brief',
    excerpt: 'Start with the task, add the context, name one constraint, and say what the answer should look like. For example, ask for a two-sentence WhatsApp reminder about a Saturday study group. Give the actual time and venue so the tool has something reliable to work with.',
    download: 'downloads/everyday-ai.pdf'
  },
  {
    id: 'botanical', category: 'wedding-cards', title: 'The Garden Invitation',
    description: 'Open a botanical wedding card and try the invitation as a guest.',
    label: 'Interactive sample', detail: 'Digital invitation · 3 sample styles',
    intro: 'Open the envelope to see how a digital invitation feels on a phone. Browse three sample celebrations, read the programme, and try the guest reply.',
    topics: ['Garden, Double Happiness, and Marigold styles', 'A ceremony programme and a calendar download', 'A sample RSVP you can try on this device'],
    invitation: true
  },
  {
    id: 'video-class', category: 'classes', title: 'Make Your First AI Video',
    description: 'Go from a scribbled idea to a short video, one shot at a time.',
    label: 'Upcoming class', detail: 'Beginner class · Taught by Nigel Tan',
    intro: 'Bring a simple idea for a short video. In this planned beginner class, Nigel will show you how to shape a script, plan your shots, and review the subtitles before you share it.',
    topics: ['Turn one idea into a 30-second script', 'Sketch a three-shot storyboard', 'Review captions and make a final cut'],
    excerptTitle: 'A warm-up before class',
    excerpt: 'Imagine filming a neighbourhood kopi stall. Write one line for the opening, one detail worth a close-up, and one line to end on. Read all three aloud. Which line could you show with your camera instead?',
    status: 'Dates and enrolment will be announced here.', bookingUrl: ''
  },
  {
    id: 'prompt-notebook', category: 'ebooks', tier: 'Essentials', title: 'The Prompt Notebook',
    description: 'A practical notebook for writing, testing, and keeping your best prompts.',
    price: 29, label: 'Ebook preview', detail: 'Essentials ebook · Preview edition',
    intro: 'Work through everyday writing tasks with a repeatable brief. Each exercise starts with a real situation and ends with a prompt you can adapt the next time.',
    topics: ['Describe the task and the reader', 'Compare two drafts side by side', 'Keep a small library of prompts that worked'],
    excerptTitle: 'Sample exercise · Make a better brief',
    excerpt: 'Take a message you often send, such as a collection reminder. Write down who will read it, what they need to do, and the one detail they must remember. Ask for a draft under 50 words, then underline every detail you supplied. Verify anything left over.',
    status: 'The full ebook is in preparation.', checkoutUrl: ''
  },
  {
    id: 'video-workbook', category: 'ebooks', tier: 'Premium', title: 'The Video Workbook',
    description: 'Plan a short video with script exercises, shot lists, and caption checklists.',
    price: 39, label: 'Ebook preview', detail: 'Premium ebook · Preview edition',
    intro: 'A workbook for the part of video-making that happens before you press record. Give each shot a job, draft a short voiceover, and build a caption pass into your edit.',
    topics: ['Choose a story you can film in one location', 'Build a shot list around the voiceover', 'Check timing and captions before export'],
    excerptTitle: 'Sample exercise · One scene, three shots',
    excerpt: 'Pick an everyday action, like packing a lunch. Write down a wide shot that sets the scene, a close-up that shows the action, and a final shot that shows the result. Ask an AI assistant for two possible voiceovers. Read each aloud while timing the sequence.',
    status: 'The full workbook is in preparation.', checkoutUrl: ''
  },
  {
    id: 'research-class', category: 'classes', title: 'AI for Investment Research',
    description: 'Use AI to read company reports and ask better research questions.',
    label: 'Upcoming class', detail: 'Beginner class · Taught by Nigel Tan',
    intro: 'Join Nigel for a planned introductory class on working with company reports. Practise asking questions about a business and tracing an AI-generated summary back to its source.',
    topics: ['Find a company’s own description of its business', 'Compare a summary with the original report', 'Build a list of questions for further research'],
    excerptTitle: 'A warm-up before class',
    excerpt: 'Choose a paragraph from a published annual report that describes what the company sells. Ask an AI tool to explain it in three sentences. Next to each sentence, copy the phrase from the report that supports it. Set aside any claim you cannot trace.',
    status: 'Dates and enrolment will be announced here.', bookingUrl: ''
  }
];

export const categories = {
  all: 'All items', ebooks: 'Ebooks', 'wedding-cards': 'Wedding cards', classes: 'Classes'
};
