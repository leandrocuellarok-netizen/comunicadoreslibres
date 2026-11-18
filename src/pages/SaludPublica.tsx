import PageLayout from '../components/PageLayout';
import { SALUD_PUBLICA } from '../content';

export default function SaludPublica() {
  return (
    <PageLayout title={SALUD_PUBLICA.pageTitle} label={SALUD_PUBLICA.pageLabel}>
      <div style={{ fontFamily: 'var(--font-body)' }}>
        <div className="text-xl text-gray-700 leading-relaxed mb-14 p-px">
          {SALUD_PUBLICA.intro.map((line, i) => (
            <p key={i} className="mb-2">
              {line}
            </p>
          ))}
        </div>

        <div className="border border-gray-200">
          {SALUD_PUBLICA.pillars.map(({ num, title, paragraphs }) => (
            <div key={num} className="grid md:grid-cols-[80px_1fr] border-b border-gray-200 last:border-b-0">
              <div className="bg-[#1c2b62] flex items-start justify-center pt-8 px-4">
                <span className="text-[#ffe900] text-sm font-bold tracking-widest">{num}</span>
              </div>
              <div className="p-8">
                <h2
                  className="text-2xl font-bold text-[#1c2b62] mb-4"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {title}
                </h2>
                {paragraphs.map((p, i) => (
                  <p key={i} className={`text-gray-700 leading-relaxed ${i < paragraphs.length - 1 ? 'mb-4' : ''}`}>
                    {p}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div style={{ fontFamily: 'var(--font-body)' }}>
          <p className="text-xl text-gray-700 leading-relaxed mb-14 pt-8">
            {SALUD_PUBLICA.postPillars}
            <br/>
            {SALUD_PUBLICA.peticion[0]}
            <a 
              href="https://change.org/visibilizarloinvisible"
              className="text-blue-600 hover:text-[#ffe900] transition-colors duration-200"
            >
              Change
            </a>
            <br/>
            {SALUD_PUBLICA.peticion[1]}
          </p>
        </div>
      </div>
    </PageLayout>
  );
}
