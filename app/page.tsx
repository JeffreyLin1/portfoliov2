export default function Home() {
  return (
    <div className="min-h-screen flex justify-center bg-white">
      <main className="w-full max-w-2xl px-6 pt-24">
        <h1 className="text-3xl font-bold">Hi! I'm Jeffrey.</h1>
        <div className="mt-2 flex gap-4 text-sm">
          <a href="https://x.com/jeeffreyLin" target="_blank" rel="noopener noreferrer" className="underline">x</a>
          <a href="https://ca.linkedin.com/in/jeffreyllin" target="_blank" rel="noopener noreferrer" className="underline">linkedin</a>
          <a href="https://github.com/JeffreyLin1" target="_blank" rel="noopener noreferrer" className="underline">github</a>
        </div>

        <p className="mt-4 text-sm leading-relaxed">
          I'm currently studying SYDE @ UWaterloo.
          When I was 8 I learned basic Turing and made 
          games with my friend on his mom's computer.
          My urge to do random stuff led to 
          building
          profitable Saas, viral gambling games, social stunts, and 
          working at companies ranging from 
          6 to 10,000 employees. 
        </p>
        <h2 className="text-l font-bold mt-8">Work</h2>

        <div className="mt-2 space-y-4 text-sm">
          <div>
            <a href="https://www.fleetline.ai/" target="_blank" rel="noopener noreferrer" className="underline">Fleetline (current)</a>
            <p className="leading-relaxed">Optimization algorithms for trucking. 
              Backed by YC (S25), Bloomberg Beta, BoxGroup, and more.</p>
          </div>

          <div>
            <a href="https://www.shopify.com" target="_blank" rel="noopener noreferrer" className="underline">Shopify (2025)</a>
            <p className="leading-relaxed">Worked on Sidekick. 
              I made a synthetic feedback loop for models to learn from mistakes,
              finetuning w/ auto generated data targetted at prod errors.
            </p>
          </div>

          <div>
            <a href="https://ca.linkedin.com/company/agentnoon" target="_blank" rel="noopener noreferrer" className="underline">Agentnoon (2025)</a>
            <p className="leading-relaxed">I worked on enterprise workforce planning software. 
              Backed by YC (W22) and got acquired by DayForce.</p>
          </div>
        </div>
        <h2 className="text-l font-bold mt-8">projects</h2>

        <div className="mt-2 space-y-4 text-sm">
          <div>
            <a href="https://jello.gg/" target="_blank" rel="noopener noreferrer" className="underline">Jello.gg</a>
            <p className="leading-relaxed">Paper.io but you bet real money via Solana.
              Blew up within the crypto community, we had
              a lot of players wagering money in real time and we were handling a lot of money.
              I launched a coin for it and it made me almost $1k
              in fees.
            </p>
          </div>

          <div>
            <a href="https://brainrot.mov/" target="_blank" rel="noopener noreferrer" className="underline">Brainrot.mov</a>
            <p className="leading-relaxed">Website to generate reels/tiktoks of 
              Peter Griffin explaining stuff to Stewey. You've probably seen 
              our videos, our users had 100k+ followers and generated
              millions of views. $1k MRR and then we sold it off (got bored).            </p>
          </div>
 
          <div>
            <a href="https://www.uwsummit.ca/" target="_blank" rel="noopener noreferrer" className="underline">UWSummit</a>
            <p className="leading-relaxed mb-20">My first viral project, Hot or Not for UWaterloo students
              but instead of looks its their linkedin, "Who's more cracked". This project
              taught me what RLS was (lol) and recieved a lot of attention (100k visits, 3 days). 
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
