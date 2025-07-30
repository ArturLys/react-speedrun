import Link from 'next/link'

export default function Home() {
  const gridElements = [
    { title: 'Stopwatch', description: 'Bad Apple stopwatch', link: '/stopwatch' },
    { title: 'Rock Paper Scissors', description: "Bet you can't win 3 in a row", link: '/rock-paper-scissors' },
    { title: 'Dice', description: 'This is the third card', link: '/dice' },
    { title: 'Card 4', description: 'This is the fourth card', link: '/card-4' },
    { title: 'Card 5', description: 'This is the fifth card', link: '/card-5' },
    { title: 'Card 6', description: 'This is the sixth card', link: '/card-6' },
    { title: 'Card 7', description: 'This is the seventh card', link: '/card-7' },
    { title: 'Card 8', description: 'This is the eighth card', link: '/card-8' },
    { title: 'Card 9', description: 'This is the ninth card', link: '/card-9' },
    { title: 'Card 10', description: 'This is the tenth card', link: '/card-10' },
    { title: 'Card 11', description: 'This is the eleventh card', link: '/card-11' },
    { title: 'Card 12', description: 'This is the twelfth card', link: '/card-12' },
    { title: 'Card 13', description: 'This is the thirteenth card', link: '/card-13' },
    { title: 'Card 14', description: 'This is the fourteenth card', link: '/card-14' },
    { title: 'Card 15', description: 'This is the fifteenth card', link: '/card-15' },
    { title: 'Card 16', description: 'This is the sixteenth card', link: '/card-16' },
  ]

  return (
    <div className="p-4">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:max-w-6xl mx-auto">
        {gridElements.map((card, index) => (
          <Link key={index} href={card.link} className="block">
            <div className="bg-primary text-white p-4 rounded-lg shadow-md hover:scale-103 transition-transform">
              <h2 className="text-lg font-bold">{card.title}</h2>
              <p>{card.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
