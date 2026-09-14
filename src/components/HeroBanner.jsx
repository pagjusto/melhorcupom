import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { POPULAR_CITIES } from '../data/mockData';
import { 
  MapPin, 
  CheckCircle2, 
  ArrowRight, 
  Zap, 
  ShieldCheck, 
  Building2,
  Navigation,
  X
} from 'lucide-react';
import { TransparentVideo } from './TransparentVideo';

export const HeroBanner = ({ 
  selectedCity, 
  setSelectedCity, 
  citySearchQuery, 
  setCitySearchQuery 
}) => {
  const { isVipUser, setIsSubscriptionModalOpen } = useApp();
  const [showDropdown, setShowDropdown] = useState(false);

  // Configurações padrão oficiais salvas:
  // Início 2.1s, Final 4.1s, Hero -120px, Container 1040px, Aura 40%
  const trimIntroSeconds = 2.1;
  const loopEndSeconds = 4.1;
  const heroOffsetY = -120;
  const containerWidth = 1040;
  const glowScale = 0.40;
  const removeGreenBg = true;
  const removeWhiteBg = false;
  const preserveWhiteContent = true;
  const trimCapCutOutro = false;
  const trimSeconds = 0;
  const transitionMode = 'crossfade';
  const transitionDuration = 0.5;
  const maskWatermark = true;
  const whiteThreshold = 215;

  // Sincroniza e garante os padrões oficiais no localStorage
  useEffect(() => {
    try {
      localStorage.setItem('melhorcupom_trim_intro', '2.1');
      localStorage.setItem('melhorcupom_loop_end', '4.1');
      localStorage.setItem('melhorcupom_hero_offset_y', '-120');
      localStorage.setItem('melhorcupom_container_width', '1040');
      localStorage.setItem('melhorcupom_glow_scale', '0.4');
    } catch (e) {}
  }, []);


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
      
      {/* Luzes de Fundo & Glow Atmosférico Laranja Ajustável */}
      <div 
        style={{
          opacity: 0.25 * glowScale,
          transform: `translateX(-50%) scale(${glowScale})`,
          transition: 'all 0.3s ease-out'
        }}
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[850px] sm:w-[1250px] h-[500px] bg-[#FF5F00] blur-[160px] pointer-events-none rounded-full" 
      />
      <div 
        style={{
          opacity: 0.10 * glowScale,
          transform: `scale(${glowScale})`,
          transition: 'all 0.3s ease-out'
        }}
        className="absolute top-10 left-1/4 w-80 h-80 bg-amber-500 blur-[110px] pointer-events-none rounded-full" 
      />
      <div 
        style={{
          opacity: 0.10 * glowScale,
          transform: `scale(${glowScale})`,
          transition: 'all 0.3s ease-out'
        }}
        className="absolute top-10 right-1/4 w-80 h-80 bg-orange-600 blur-[110px] pointer-events-none rounded-full" 
      />

      {/* Container Pai do Hero Banner com Largura Ajustável */}
      <div 
        style={{ 
          maxWidth: `${containerWidth}px`,
          transition: 'max-width 0.25s ease-out'
        }}
        className="w-full mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center"
      >
        
        {/* LOGO OU VÍDEO NO MEIO DO APP (TAMANHO 2X) */}
        <div className="relative flex flex-col justify-center items-center my-4 group">
          <div 
            style={{
              opacity: 0.20 * glowScale,
              transform: `scale(${1.5 * glowScale})`,
              transition: 'all 0.3s ease-out'
            }}
            className="absolute inset-0 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500 blur-3xl -z-10 rounded-full pointer-events-none" 
          />
          
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
