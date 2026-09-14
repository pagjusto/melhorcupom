import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { POPULAR_CITIES } from '../data/mockData';
import { 
  MapPin, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  Zap, 
  ShieldCheck, 
  Navigation, 
  X, 
  Building2, 
  Globe,
  Sliders
} from 'lucide-react';
import logoMelhorCupom from '../assets/logo-melhor-cupom.png';
import { TransparentVideo } from './TransparentVideo';

export const HeroBanner = ({ 
  selectedCity, 
  setSelectedCity, 
  citySearchQuery, 
  setCitySearchQuery 
}) => {
  const { isVipUser, setIsSubscriptionModalOpen } = useApp();
  const [showDropdown, setShowDropdown] = useState(false);
  // Estado para visualização do logo oficial ou teste de vídeo
  // 'video_transparent' | 'static_image' | 'video_mp4'
  const [mediaType, setMediaType] = useState('video_transparent');
  const [trimIntroSeconds, setTrimIntroSeconds] = useState(2.0); // Cortar os primeiros 2 segundos do vídeo
  const [loopEndSeconds, setLoopEndSeconds] = useState(10); // [✂️ final : 10] Ponto final do looping
  const [heroOffsetY, setHeroOffsetY] = useState(0); // Ajuste da localização da hero (mais pra cima ou pra baixo da navbar)
  const [removeGreenBg, setRemoveGreenBg] = useState(true);
  const [removeWhiteBg, setRemoveWhiteBg] = useState(false);
  const [preserveWhiteContent, setPreserveWhiteContent] = useState(true);
  const [trimCapCutOutro, setTrimCapCutOutro] = useState(false);
  const [trimSeconds, setTrimSeconds] = useState(0);
  const [transitionMode, setTransitionMode] = useState('crossfade');
  const [transitionDuration, setTransitionDuration] = useState(0.5);
  const [maskWatermark, setMaskWatermark] = useState(true);
  const [whiteThreshold, setWhiteThreshold] = useState(215);

  // Filtrar cidades disponíveis com base no texto digitado
  const filteredCities = POPULAR_CITIES.filter(city => 
    city.toLowerCase().includes(citySearchQuery.toLowerCase())
  );

  const handleSelectCity = (city) => {
    setSelectedCity(city);
    setCitySearchQuery('');
    setShowDropdown(false);
  };

  return (
    <div 
      style={{
        paddingTop: `${Math.max(12, 56 + heroOffsetY)}px`,
        marginTop: heroOffsetY < -44 ? `${heroOffsetY + 44}px` : undefined,
        transition: 'padding-top 0.25s cubic-bezier(0.16, 1, 0.3, 1), margin-top 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
      }}
      className="relative overflow-hidden bg-gradient-to-b from-[#1E110A] via-[#14141C] to-[#0D0D11] border-b border-white/5 pb-14 sm:pb-20"
    >
      
      {/* Luzes de Fundo & Glow Atmosférico Laranja Expandido para Vídeo 2x */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[850px] sm:w-[1250px] h-[500px] bg-[#FF5F00]/25 blur-[160px] pointer-events-none rounded-full" />
      <div className="absolute top-10 left-1/4 w-80 h-80 bg-amber-500/10 blur-[110px] pointer-events-none rounded-full" />
      <div className="absolute top-10 right-1/4 w-80 h-80 bg-orange-600/10 blur-[110px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        
        {/* LOGO OU VÍDEO NO MEIO DO APP (TAMANHO 2X) */}
        <div className="relative flex flex-col justify-center items-center my-4 group">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 via-amber-500/20 to-orange-500/20 blur-3xl -z-10 rounded-full scale-150 pointer-events-none" />
          
          {mediaType === 'video_transparent' && (
            <TransparentVideo
              src="/video_loop_32s.mp4"
              containerClassName="w-full max-w-[680px] sm:max-w-[880px] md:max-w-[1080px] lg:max-w-[1200px] xl:max-w-[1300px]"
              trimIntroSeconds={trimIntroSeconds}
              loopEndSeconds={loopEndSeconds}
              removeGreen={removeGreenBg}
              removeWhite={removeWhiteBg}
              preserveWhiteContent={preserveWhiteContent}
              threshold={whiteThreshold}
              feather={25}
              trimOutro={trimCapCutOutro}
              trimOutroSeconds={trimSeconds}
              transitionMode={transitionMode}
              transitionDuration={transitionDuration}
              maskWatermark={maskWatermark}
              className="w-full h-auto object-contain drop-shadow-[0_25px_45px_rgba(255,95,0,0.35)] transition-transform duration-500 hover:scale-102 select-none"
              alt="Melhor Cupom Vídeo 32s"
            />
          )}

          {mediaType === 'video_mp4' && (
            <video 
              key="video_mp4"
              autoPlay 
              loop 
              muted 
              playsInline
              controls
              onLoadedMetadata={(e) => {
                if (e.target.currentTime < trimIntroSeconds) {
                  e.target.currentTime = trimIntroSeconds;
                }
              }}
              onTimeUpdate={(e) => {
                if (e.target.currentTime < trimIntroSeconds - 0.1) {
                  e.target.currentTime = trimIntroSeconds;
                }
                if (loopEndSeconds > 0 && e.target.currentTime >= loopEndSeconds) {
                  e.target.currentTime = trimIntroSeconds;
                }
              }}
              className="w-full max-w-[680px] sm:max-w-[880px] md:max-w-[1080px] lg:max-w-[1200px] xl:max-w-[1300px] h-auto rounded-3xl border-2 border-[#FF5F00]/40 shadow-2xl shadow-orange-950/60 transition-transform duration-500 hover:scale-102"
            >
              <source src="/video_loop_32s.mp4#t=2" type="video/mp4" />
            </video>
          )}

          {mediaType === 'static_image' && (
            <img 
              src={logoMelhorCupom} 
              alt="Melhor Cupom" 
              className="w-full max-w-[680px] sm:max-w-[880px] md:max-w-[1080px] lg:max-w-[1200px] xl:max-w-[1300px] h-auto object-contain drop-shadow-[0_25px_45px_rgba(255,95,0,0.35)] transition-transform duration-500 hover:scale-102 select-none"
            />
          )}

          {/* Seletor Rápido de Teste & Controle de Fundo Transparente */}
          <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-2 mt-4 bg-[#14141E]/95 border border-white/10 p-2 rounded-2xl backdrop-blur-md shadow-xl">
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-gray-400 font-semibold px-2">Modo:</span>
              <button
                onClick={() => setMediaType('static_image')}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                  mediaType === 'static_image'
                    ? 'bg-[#FF5F00] text-white shadow-md shadow-orange-600/30'
                    : 'bg-white/5 hover:bg-white/10 text-gray-300'
                }`}
              >
                <span>🖼️ Nova Logo Oficial</span>
              </button>
              <button
                onClick={() => setMediaType('video_transparent')}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                  mediaType === 'video_transparent'
                    ? 'bg-[#FF5F00] text-white shadow-md shadow-orange-600/30'
                    : 'bg-white/5 hover:bg-white/10 text-gray-300'
                }`}
              >
                <span>🎬 Vídeo 32s (Chroma Key)</span>
              </button>
              <button
                onClick={() => setMediaType('video_mp4')}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                  mediaType === 'video_mp4'
                    ? 'bg-[#FF5F00] text-white shadow-md shadow-orange-600/30'
                    : 'bg-white/5 hover:bg-white/10 text-gray-300'
                }`}
              >
                <span>🎥 Player MP4</span>
              </button>

              {/* Controle Interativo de Posição da Hero (Mais pra Cima ou Mais pra Baixo da Navbar) */}
              <div className="flex items-center gap-1.5 ml-1 pl-2 border-l border-white/10 bg-white/5 px-2.5 py-1 rounded-xl text-[11px] text-gray-300 font-bold" title="Ajusta a localização do hero, mais pra cima ou pra baixo da navbar">
                <span className="text-cyan-400">↕️ Hero:</span>
                <span className="font-mono text-white text-[11px] min-w-[32px] text-center">
                  {heroOffsetY > 0 ? `+${heroOffsetY}px` : `${heroOffsetY}px`}
                </span>
                <div className="flex items-center gap-1 ml-0.5">
                  <button
                    onClick={() => setHeroOffsetY(prev => prev - 10)}
                    className="px-2 py-0.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-black transition-colors text-xs flex items-center gap-0.5 shadow-sm active:scale-95"
                    title="Mover Hero mais pra CIMA (aproximar da navbar)"
                  >
                    ▲ Cima
                  </button>
                  <button
                    onClick={() => setHeroOffsetY(prev => prev + 10)}
                    className="px-2 py-0.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-black transition-colors text-xs flex items-center gap-0.5 shadow-sm active:scale-95"
                    title="Mover Hero mais pra BAIXO (afastar da navbar)"
                  >
                    ▼ Baixo
                  </button>
                  {heroOffsetY !== 0 && (
                    <button
                      onClick={() => setHeroOffsetY(0)}
                      className="px-1.5 py-0.5 rounded-lg bg-white/5 hover:bg-white/15 text-gray-400 hover:text-white transition-colors text-[10px]"
                      title="Restaurar posição original (0px)"
                    >
                      ↺
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Controles de Remoção de Fundo quando o vídeo estiver ativo */}
            {mediaType === 'video_transparent' && (
              <div className="flex flex-wrap items-center gap-1.5 pt-1.5 sm:pt-0 sm:pl-2 sm:border-l sm:border-white/10">
                {/* Botão Fundo Verde Chroma Key */}
                <button
                  onClick={() => setRemoveGreenBg(!removeGreenBg)}
                  className={`px-2.5 py-1 rounded-xl text-[11px] font-black transition-all border flex items-center gap-1 ${
                    removeGreenBg
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm'
                      : 'bg-red-500/20 text-red-300 border-red-500/40'
                  }`}
                  title="Remove o fundo verde chroma-key preservando as letras e o mascote"
                >
                  <span>{removeGreenBg ? '✓ Fundo Verde Removido' : '✕ Fundo Verde Visível'}</span>
                </button>

                {/* Botão Letras Brancas Preservadas */}
                <button
                  onClick={() => setPreserveWhiteContent(!preserveWhiteContent)}
                  className={`px-2.5 py-1 rounded-xl text-[11px] font-black transition-all border flex items-center gap-1 ${
                    preserveWhiteContent
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm'
                      : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  }`}
                  title="Preserva o branco das letras Melhor Cupom e do boneco usando algoritmo de borda"
                >
                  <span>{preserveWhiteContent ? '✓ Letras & Mascote Preservados' : '✕ Vazado'}</span>
                </button>

                {/* Botão Cortar Final CapCut */}
                <button
                  onClick={() => setTrimCapCutOutro(!trimCapCutOutro)}
                  className={`px-2.5 py-1 rounded-xl text-[11px] font-black transition-all border flex items-center gap-1 ${
                    trimCapCutOutro
                      ? 'bg-blue-500/20 text-blue-300 border-blue-500/40 shadow-sm'
                      : 'bg-gray-800 text-gray-400 border-white/10'
                  }`}
                  title="Corta a vinheta final automática do CapCut"
                >
                  <span>{trimCapCutOutro ? '✓ Sem Vinheta CapCut' : '✕ Com Vinheta Final'}</span>
                </button>

                {/* Botão Mascarar Marca d'Água de Canto */}
                <button
                  onClick={() => setMaskWatermark(!maskWatermark)}
                  className={`px-2.5 py-1 rounded-xl text-[11px] font-black transition-all border flex items-center gap-1 ${
                    maskWatermark
                      ? 'bg-purple-500/20 text-purple-300 border-purple-500/40 shadow-sm'
                      : 'bg-gray-800 text-gray-400 border-white/10'
                  }`}
                  title="Remove marca d'água residual dos cantos do CapCut"
                >
                  <span>{maskWatermark ? '✓ Sem Marca d\'Água' : '✕ Com Marca d\'Água'}</span>
                </button>

                {/* Seletor de Tipo de Transição */}
                <div className="flex items-center gap-1 bg-white/5 border border-white/10 px-2 py-0.5 rounded-xl text-[11px] text-gray-300 font-bold" title="Tipo de transição ao reiniciar o ciclo de loop">
                  <span className="text-amber-400">✨ Transição:</span>
                  <button
                    onClick={() => setTransitionMode('crossfade')}
                    className={`px-2 py-0.5 rounded-lg text-[10px] font-black transition-all ${
                      transitionMode === 'crossfade'
                        ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-sm'
                        : 'text-gray-400 hover:text-white'
                    }`}
                    title="Dissolvência contínua entre ciclos (sem corte seco e sem travamento)"
                  >
                    Dissolvência
                  </button>
                  <button
                    onClick={() => setTransitionMode('fade')}
                    className={`px-2 py-0.5 rounded-lg text-[10px] font-black transition-all ${
                      transitionMode === 'fade'
                        ? 'bg-blue-500 text-white shadow-sm'
                        : 'text-gray-400 hover:text-white'
                    }`}
                    title="Desvanecimento suave (fade-out e fade-in elegante)"
                  >
                    Fade
                  </button>
                  <button
                    onClick={() => setTransitionMode('cut')}
                    className={`px-2 py-0.5 rounded-lg text-[10px] font-black transition-all ${
                      transitionMode === 'cut'
                        ? 'bg-gray-700 text-white shadow-sm'
                        : 'text-gray-400 hover:text-white'
                    }`}
                    title="Corte instantâneo direto"
                  >
                    Direto
                  </button>
                </div>

                {/* Ajuste Fino da Duração da Transição (Suavidade) */}
                {transitionMode !== 'cut' && (
                  <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-2 py-0.5 rounded-xl text-[11px] text-gray-300 font-bold" title="Permite valores positivos (tempo de dissolvência) ou negativos abaixo de 0 (corta o início do vídeo)">
                    <span className="text-cyan-400">⏱️ Suavidade:</span>
                    <span className="font-mono text-white text-[11px]">
                      {transitionDuration > 0 ? `+${transitionDuration.toFixed(1)}s` : `${transitionDuration.toFixed(1)}s`}
                    </span>
                    <div className="flex items-center gap-0.5 ml-0.5">
                      <button
                        onClick={() => setTransitionDuration(prev => parseFloat((prev - 0.1).toFixed(1)))}
                        className="w-5 h-5 rounded bg-white/10 hover:bg-white/20 text-white font-black flex items-center justify-center transition-colors text-xs"
                        title="Diminuir suavidade (permite valores negativos abaixo de 0)"
                      >
                        -
                      </button>
                      <button
                        onClick={() => setTransitionDuration(prev => parseFloat((prev + 0.1).toFixed(1)))}
                        className="w-5 h-5 rounded bg-white/10 hover:bg-white/20 text-white font-black flex items-center justify-center transition-colors text-xs"
                        title="Aumentar suavidade (+0.1s)"
                      >
                        +
                      </button>
                    </div>
                  </div>
                )}

                {/* Ajuste do Corte de Início (Corta os Primeiros 2 Segundos) */}
                <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-2 py-0.5 rounded-xl text-[11px] text-gray-300 font-bold" title="Corta os primeiros segundos do vídeo (ex: 2.0s)">
                  <span className="text-amber-400">✂️ Início:</span>
                  <span className="font-mono text-white text-[11px]">
                    {trimIntroSeconds.toFixed(1)}s
                  </span>
                  <div className="flex items-center gap-0.5 ml-0.5">
                    <button
                      onClick={() => setTrimIntroSeconds(prev => Math.max(0, parseFloat((prev - 0.5).toFixed(1))))}
                      className="w-5 h-5 rounded bg-white/10 hover:bg-white/20 text-white font-black flex items-center justify-center transition-colors text-xs"
                      title="Diminuir corte de início (-0.5s)"
                    >
                      -
                    </button>
                    <button
                      onClick={() => setTrimIntroSeconds(prev => parseFloat((prev + 0.5).toFixed(1)))}
                      className="w-5 h-5 rounded bg-white/10 hover:bg-white/20 text-white font-black flex items-center justify-center transition-colors text-xs"
                      title="Aumentar corte de início (+0.5s)"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Ajuste do Ponto Final do Looping [✂️ final : 10] */}
                <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-2 py-0.5 rounded-xl text-[11px] text-gray-300 font-bold" title="Define o ponto final do looping do vídeo [✂️ final : 10]">
                  <span className="text-orange-400">✂️ final :</span>
                  <span className="font-mono text-white text-[11px] min-w-[18px] text-center">
                    {loopEndSeconds}
                  </span>
                  <div className="flex items-center gap-0.5 ml-0.5">
                    <button
                      onClick={() => setLoopEndSeconds(prev => Math.max(Math.ceil(trimIntroSeconds + 1), prev - 1))}
                      className="w-5 h-5 rounded bg-white/10 hover:bg-white/20 text-white font-black flex items-center justify-center transition-colors text-xs active:scale-95"
                      title="Diminuir ponto final do loop (-1s)"
                    >
                      -
                    </button>
                    <button
                      onClick={() => setLoopEndSeconds(prev => prev + 1)}
                      className="w-5 h-5 rounded bg-white/10 hover:bg-white/20 text-white font-black flex items-center justify-center transition-colors text-xs active:scale-95"
                      title="Aumentar ponto final do loop (+1s)"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 3. Headline & Descrição */}
        <div className="max-w-3xl mx-auto mt-6 mb-8 space-y-3">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white leading-tight font-display tracking-tight">
            Aqui você Encontra os melhores cupons do <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF5F00] via-[#FF8038] to-[#FFB703]">Brasil !</span>
          </h2>

          <p className="text-sm sm:text-base md:text-lg text-gray-300 font-medium leading-relaxed max-w-2xl mx-auto">
            Onde lojas e locais credenciados oferecem os melhores descontos exclusivos para assinantes do Clube!
          </p>
        </div>

        {/* 4. BUSCADOR FOCADO EM CIDADE */}
        <div className="max-w-2xl mx-auto relative mb-6">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2 text-center sm:text-left">
            📍 Em qual cidade você deseja economizar hoje?
          </label>

          <div className="relative flex items-center bg-[#1B1B26]/95 backdrop-blur-md border-2 border-[#FF5F00]/60 rounded-2xl p-2 sm:p-2.5 shadow-2xl focus-within:border-[#FF5F00] focus-within:ring-4 focus-within:ring-orange-500/30 transition-all">
            <div className="w-10 h-10 rounded-xl bg-[#FF5F00]/20 flex items-center justify-center text-[#FF5F00] ml-1 flex-shrink-0">
              <MapPin size={22} className="animate-bounce" />
            </div>

            <input
              type="text"
              value={citySearchQuery}
              onChange={(e) => {
                setCitySearchQuery(e.target.value);
                setShowDropdown(true);
              }}
              onFocus={() => setShowDropdown(true)}
              placeholder="Digite sua cidade (ex: São Paulo, Rio de Janeiro, Curitiba...)"
              className="w-full bg-transparent px-3 py-2 text-sm sm:text-base text-white placeholder-gray-400 focus:outline-none font-semibold"
            />

            {citySearchQuery ? (
              <button 
                onClick={() => {
                  setCitySearchQuery('');
                  setSelectedCity('Todas as Cidades');
                }}
                className="p-1.5 text-gray-400 hover:text-white bg-white/10 rounded-lg mr-2"
                title="Limpar cidade"
              >
                <X size={16} />
              </button>
            ) : null}

            <button
              onClick={() => {
                if (filteredCities.length > 0) {
                  handleSelectCity(filteredCities[0]);
                }
              }}
              className="bg-[#FF5F00] hover:bg-[#E04F00] text-white px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-md transition-all flex-shrink-0"
            >
              <Navigation size={14} />
              <span className="hidden sm:inline">Filtrar Cidade</span>
            </button>
          </div>

          {/* Autocomplete Dropdown de Cidades */}
          {showDropdown && filteredCities.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-[#181824] border-2 border-white/15 rounded-2xl shadow-2xl overflow-hidden z-30 text-left animate-fade-in">
              <div className="p-2 text-[11px] font-bold text-gray-400 uppercase tracking-wider border-b border-white/10">
                Selecione sua cidade:
              </div>
              {filteredCities.map((city, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectCity(city)}
                  className={`w-full px-4 py-3 text-sm text-left flex items-center justify-between hover:bg-white/10 transition-colors ${
                    selectedCity === city ? 'bg-[#FF5F00]/20 text-orange-400 font-bold' : 'text-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <MapPin size={16} className={selectedCity === city ? 'text-[#FF5F00]' : 'text-gray-400'} />
                    <span>{city}</span>
                  </div>
                  {selectedCity === city && (
                    <span className="text-[11px] text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-full">
                      Ativa
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Atalhos Rápidos para Cidades Mais Populares */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-3">
            <span className="text-xs text-gray-400 font-medium">Cidades em destaque:</span>
            {POPULAR_CITIES.map((city, idx) => {
              const isCurrent = selectedCity === city;
              return (
                <button
                  key={idx}
                  onClick={() => handleSelectCity(city)}
                  className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                    isCurrent
                      ? 'bg-[#FF5F00] text-white shadow-md shadow-orange-600/30'
                      : 'bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10'
                  }`}
                >
                  <MapPin size={11} className={isCurrent ? 'text-white' : 'text-orange-400'} />
                  <span>{city}</span>
                </button>
              );
            })}
          </div>

          {/* Feedback de Cidade Ativa */}
          {selectedCity && selectedCity !== 'Todas as Cidades' && (
            <div className="mt-4 inline-flex items-center gap-2 bg-emerald-500/15 border border-emerald-500/30 px-3.5 py-1.5 rounded-xl text-xs text-emerald-300">
              <Building2 size={14} className="text-emerald-400" />
              <span>
                Mostrando cupons locais em: <strong className="text-white">{selectedCity}</strong>
              </span>
              <button
                onClick={() => setSelectedCity('Todas as Cidades')}
                className="underline hover:text-white ml-2 text-emerald-400"
              >
                (Ver Todas)
              </button>
            </div>
          )}
        </div>

        {/* 5. Ação VIP / CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          {!isVipUser ? (
            <button
              onClick={() => setIsSubscriptionModalOpen(true)}
              className="w-full sm:w-auto bg-gradient-to-r from-[#FF5F00] via-[#FF7518] to-[#FFA000] hover:from-[#E04F00] hover:to-[#FF8800] text-white font-extrabold px-8 py-3.5 rounded-2xl shadow-xl shadow-orange-600/40 hover:shadow-orange-600/60 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              <Zap size={18} className="text-amber-200 fill-amber-200" />
              <span>Assinar VIP por apenas R$ 19,90/mês</span>
              <ArrowRight size={18} />
            </button>
          ) : (
            <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold px-6 py-2.5 rounded-2xl text-sm shadow-md">
              <CheckCircle2 size={18} className="text-emerald-400" />
              <span>Membro VIP Ativo! Aproveite os descontos da sua cidade abaixo.</span>
            </div>
          )}
        </div>

        {/* 6. Selos de Confiança */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs text-gray-400 mt-8 pt-6 border-t border-white/5 font-medium">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 size={15} className="text-[#FF5F00]" />
            Cupons com validação no balcão
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 size={15} className="text-[#FF5F00]" />
            Economia média de R$ 420/mês
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 size={15} className="text-[#FF5F00]" />
            Sem fidelidade, cancele quando quiser
          </span>
          <span className="flex items-center gap-1.5">
            <ShieldCheck size={15} className="text-emerald-400" />
            7 dias de garantia incondicional
          </span>
        </div>

      </div>
    </div>
  );
};
