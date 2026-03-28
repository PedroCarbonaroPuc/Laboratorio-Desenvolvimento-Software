import { useState, useRef, useCallback } from 'react';
import {
  FlaskConical, Play, Square, Zap, Database, Globe, Layers,
  Clock, Activity, Cpu, HardDrive, TrendingUp, TrendingDown,
  BarChart3, Timer, Server, Wifi, CheckCircle2,
  Info, ChevronDown, ChevronUp, Trophy,
} from 'lucide-react';
import { runLoadTest, LoadTestEvent, LoadTestResult, LoadTestRequest } from '../../api/loadtest.api';

type TestType = 'database_read' | 'io_simulation' | 'concurrent_load' | 'mixed_workload';

interface TestConfig {
  type: TestType;
  label: string;
  description: string;
  icon: typeof Database;
  details: string;
}

const TEST_TYPES: TestConfig[] = [
  {
    type: 'database_read',
    label: 'Leitura de Banco',
    description: 'Consultas simultâneas ao MongoDB',
    icon: Database,
    details: 'Executa findAll() em veículos e pedidos para cada requisição. Ideal para comparar a eficiência de drivers bloqueantes (Spring Data MongoDB) vs. reativos (Spring Data MongoDB Reactive).',
  },
  {
    type: 'io_simulation',
    label: 'Simulação de I/O',
    description: 'Simula chamadas a APIs externas',
    icon: Globe,
    details: 'Simula latência de rede com Thread.sleep() (bloqueante) vs. Mono.delay() (reativo). Este é o cenário onde o WebFlux mostra sua maior vantagem: threads não ficam bloqueadas aguardando I/O.',
  },
  {
    type: 'concurrent_load',
    label: 'Carga Concorrente',
    description: 'Banco + I/O com alta concorrência',
    icon: Layers,
    details: 'Combina operações de banco de dados com pequenos delays de I/O (10ms). Testa o comportamento sob alta concorrência simultânea.',
  },
  {
    type: 'mixed_workload',
    label: 'Carga Mista',
    description: 'Banco + I/O + CPU combinados',
    icon: Cpu,
    details: 'Simula um cenário real: consulta ao banco, espera por API externa, contagem de registros e processamento CPU. O cenário mais próximo da realidade.',
  },
];

const CONCURRENCY_OPTIONS = [10, 25, 50, 100, 200, 500];
const REQUEST_OPTIONS = [50, 100, 200, 500, 1000];
const IO_DELAY_OPTIONS = [50, 100, 200, 500, 1000];

function formatMs(ms: number): string {
  if (ms < 1) return '<1ms';
  if (ms < 1000) return `${Math.round(ms)}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
}

function formatThroughput(t: number): string {
  return `${t.toFixed(1)} req/s`;
}

function getWinner(mvc: number, webflux: number, lowerIsBetter: boolean): 'mvc' | 'webflux' | 'tie' {
  if (Math.abs(mvc - webflux) < 0.01) return 'tie';
  if (lowerIsBetter) return mvc < webflux ? 'mvc' : 'webflux';
  return mvc > webflux ? 'mvc' : 'webflux';
}

function WinnerBadge({ winner }: { winner: 'mvc' | 'webflux' | 'tie' }) {
  if (winner === 'tie') return <span className="text-xs text-primary-400">Empate</span>;
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-bold ${
      winner === 'mvc' ? 'text-orange-500' : 'text-emerald-500'
    }`}>
      <Trophy className="w-3 h-3" />
      {winner === 'mvc' ? 'MVC' : 'WebFlux'}
    </span>
  );
}

export default function LoadTests() {
  const [selectedType, setSelectedType] = useState<TestType>('database_read');
  const [totalRequests, setTotalRequests] = useState(100);
  const [concurrency, setConcurrency] = useState(50);
  const [ioDelay, setIoDelay] = useState(100);
  const [isRunning, setIsRunning] = useState(false);
  const [expandedInfo, setExpandedInfo] = useState<string | null>(null);

  const [mvcProgress, setMvcProgress] = useState(0);
  const [webfluxProgress, setWebfluxProgress] = useState(0);
  const [mvcAvg, setMvcAvg] = useState(0);
  const [webfluxAvg, setWebfluxAvg] = useState(0);
  const [currentPhase, setCurrentPhase] = useState<'idle' | 'mvc' | 'webflux' | 'done'>('idle');
  const [statusMessage, setStatusMessage] = useState('');

  const [mvcResult, setMvcResult] = useState<LoadTestResult | null>(null);
  const [webfluxResult, setWebfluxResult] = useState<LoadTestResult | null>(null);
  const [testHistory, setTestHistory] = useState<Array<{ mvc: LoadTestResult; webflux: LoadTestResult; timestamp: Date }>>([]);

  const abortRef = useRef<(() => void) | null>(null);

  const handleEvent = useCallback((event: LoadTestEvent) => {
    switch (event.type) {
      case 'progress':
        if (event.architecture === 'SPRING_MVC') {
          setCurrentPhase('mvc');
          setMvcProgress(Math.round((event.completedRequests / event.totalRequests) * 100));
          if (event.currentAvgMs) setMvcAvg(event.currentAvgMs);
        } else {
          setCurrentPhase('webflux');
          setWebfluxProgress(Math.round((event.completedRequests / event.totalRequests) * 100));
          if (event.currentAvgMs) setWebfluxAvg(event.currentAvgMs);
        }
        if (event.message) setStatusMessage(event.message);
        break;
      case 'result':
        if (event.result) {
          if (event.architecture === 'SPRING_MVC') {
            setMvcResult(event.result);
            setMvcProgress(100);
          } else {
            setWebfluxResult(event.result);
            setWebfluxProgress(100);
          }
        }
        break;
      case 'complete':
        setCurrentPhase('done');
        setIsRunning(false);
        setStatusMessage('Testes concluídos!');
        break;
      case 'error':
        setIsRunning(false);
        setStatusMessage(`Erro: ${event.message}`);
        break;
    }
  }, []);

  const handleRunTest = () => {
    setIsRunning(true);
    setMvcProgress(0);
    setWebfluxProgress(0);
    setMvcAvg(0);
    setWebfluxAvg(0);
    setMvcResult(null);
    setWebfluxResult(null);
    setCurrentPhase('idle');
    setStatusMessage('Preparando testes...');

    const request: LoadTestRequest = {
      testType: selectedType,
      totalRequests,
      concurrencyLevel: concurrency,
      ioDelayMs: ioDelay,
    };

    const abort = runLoadTest(
      request,
      (event) => {
        handleEvent(event);
        if (event.type === 'complete') {
          setMvcResult((prevMvc) => {
            setWebfluxResult((prevWf) => {
              if (prevMvc && prevWf) {
                setTestHistory((h) => [{ mvc: prevMvc, webflux: prevWf, timestamp: new Date() }, ...h].slice(0, 10));
              }
              return prevWf;
            });
            return prevMvc;
          });
        }
      },
      (err) => {
        setIsRunning(false);
        setStatusMessage(`Erro de conexão: ${err}`);
      },
      () => {},
    );

    abortRef.current = abort;
  };

  const handleStop = () => {
    if (abortRef.current) abortRef.current();
    setIsRunning(false);
    setStatusMessage('Teste cancelado');
  };

  const showIoDelay = selectedType === 'io_simulation' || selectedType === 'mixed_workload';
  const hasResults = mvcResult && webfluxResult;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-accent/10 dark:bg-accent/20 p-2.5 rounded-xl">
            <FlaskConical className="w-6 h-6 text-accent" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-primary-900 dark:text-white">Testes de Carga</h1>
            <p className="text-primary-500 dark:text-primary-400">
              Comparação em tempo real: Spring MVC (Bloqueante) vs Spring WebFlux (Reativo)
            </p>
          </div>
        </div>
      </div>

      {/* Architecture Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card p-5 border-l-4 border-l-orange-500">
          <div className="flex items-center gap-3 mb-2">
            <Server className="w-5 h-5 text-orange-500" />
            <h3 className="font-bold text-primary-900 dark:text-white">Spring MVC</h3>
            <span className="text-xs bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 px-2 py-0.5 rounded-full font-medium">Bloqueante</span>
          </div>
          <p className="text-sm text-primary-500 dark:text-primary-400">
            Modelo thread-per-request. Cada requisição ocupa uma thread do pool durante toda a execução, incluindo I/O. Simples e previsível, ideal para cargas moderadas.
          </p>
        </div>
        <div className="card p-5 border-l-4 border-l-emerald-500">
          <div className="flex items-center gap-3 mb-2">
            <Wifi className="w-5 h-5 text-emerald-500" />
            <h3 className="font-bold text-primary-900 dark:text-white">Spring WebFlux</h3>
            <span className="text-xs bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full font-medium">Reativo</span>
          </div>
          <p className="text-sm text-primary-500 dark:text-primary-400">
            Modelo event-loop non-blocking. Poucas threads atendem milhares de requisições via programação reativa (Project Reactor). Excelente para alta concorrência com I/O intensivo.
          </p>
        </div>
      </div>

      {/* Test Configuration */}
      <div className="card p-6">
        <h2 className="text-lg font-bold text-primary-900 dark:text-white mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-accent" />
          Configuração do Teste
        </h2>

        {/* Test Type Selection */}
        <div className="mb-5">
          <label className="text-sm font-semibold text-primary-700 dark:text-primary-300 mb-2 block">Tipo de Teste</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {TEST_TYPES.map((t) => {
              const Icon = t.icon;
              const isSelected = selectedType === t.type;
              return (
                <div key={t.type}>
                  <button
                    onClick={() => setSelectedType(t.type)}
                    disabled={isRunning}
                    className={`w-full p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                      isSelected
                        ? 'border-accent bg-accent/5 dark:bg-accent/10 shadow-md'
                        : 'border-primary-200 dark:border-primary-600 hover:border-primary-300 dark:hover:border-primary-500'
                    } disabled:opacity-50`}
                  >
                    <Icon className={`w-5 h-5 mb-2 ${isSelected ? 'text-accent' : 'text-primary-400'}`} />
                    <p className={`font-semibold text-sm ${isSelected ? 'text-accent' : 'text-primary-900 dark:text-white'}`}>
                      {t.label}
                    </p>
                    <p className="text-xs text-primary-500 dark:text-primary-400 mt-0.5">{t.description}</p>
                  </button>
                  <button
                    onClick={() => setExpandedInfo(expandedInfo === t.type ? null : t.type)}
                    className="flex items-center gap-1 text-xs text-accent mt-1 px-1 hover:underline"
                  >
                    <Info className="w-3 h-3" />
                    Detalhes
                    {expandedInfo === t.type ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  </button>
                  {expandedInfo === t.type && (
                    <div className="mt-1 p-3 bg-primary-50 dark:bg-primary-700 rounded-lg text-xs text-primary-600 dark:text-primary-300 leading-relaxed">
                      {t.details}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Parameters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-5">
          <div>
            <label className="text-sm font-semibold text-primary-700 dark:text-primary-300 mb-2 block">
              Total de Requisições
            </label>
            <div className="flex flex-wrap gap-2">
              {REQUEST_OPTIONS.map((n) => (
                <button
                  key={n}
                  onClick={() => setTotalRequests(n)}
                  disabled={isRunning}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    totalRequests === n
                      ? 'bg-accent text-white'
                      : 'bg-primary-100 dark:bg-primary-700 text-primary-600 dark:text-primary-300 hover:bg-primary-200 dark:hover:bg-primary-600'
                  } disabled:opacity-50`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-primary-700 dark:text-primary-300 mb-2 block">
              Concorrência (paralelo)
            </label>
            <div className="flex flex-wrap gap-2">
              {CONCURRENCY_OPTIONS.map((n) => (
                <button
                  key={n}
                  onClick={() => setConcurrency(n)}
                  disabled={isRunning}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    concurrency === n
                      ? 'bg-accent text-white'
                      : 'bg-primary-100 dark:bg-primary-700 text-primary-600 dark:text-primary-300 hover:bg-primary-200 dark:hover:bg-primary-600'
                  } disabled:opacity-50`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          {showIoDelay && (
            <div>
              <label className="text-sm font-semibold text-primary-700 dark:text-primary-300 mb-2 block">
                Latência I/O Simulada
              </label>
              <div className="flex flex-wrap gap-2">
                {IO_DELAY_OPTIONS.map((n) => (
                  <button
                    key={n}
                    onClick={() => setIoDelay(n)}
                    disabled={isRunning}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      ioDelay === n
                        ? 'bg-accent text-white'
                        : 'bg-primary-100 dark:bg-primary-700 text-primary-600 dark:text-primary-300 hover:bg-primary-200 dark:hover:bg-primary-600'
                    } disabled:opacity-50`}
                  >
                    {n}ms
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Run Button */}
        <div className="flex items-center gap-3">
          {!isRunning ? (
            <button onClick={handleRunTest} className="btn-primary flex items-center gap-2">
              <Play className="w-4 h-4" /> Executar Teste
            </button>
          ) : (
            <button onClick={handleStop} className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-xl transition-colors flex items-center gap-2">
              <Square className="w-4 h-4" /> Parar Teste
            </button>
          )}
          {statusMessage && (
            <span className="text-sm text-primary-500 dark:text-primary-400 flex items-center gap-1">
              {isRunning && <Activity className="w-4 h-4 animate-pulse text-accent" />}
              {statusMessage}
            </span>
          )}
        </div>
      </div>

      {/* Real-time Progress */}
      {(isRunning || currentPhase === 'done') && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="card p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Server className="w-4 h-4 text-orange-500" />
                <h3 className="font-bold text-primary-900 dark:text-white text-sm">Spring MVC</h3>
              </div>
              {currentPhase === 'mvc' && <Activity className="w-4 h-4 text-orange-500 animate-pulse" />}
              {mvcResult && <CheckCircle2 className="w-4 h-4 text-success" />}
            </div>
            <div className="w-full bg-primary-200 dark:bg-primary-700 rounded-full h-3 mb-2">
              <div
                className="bg-orange-500 h-3 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${mvcProgress}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-primary-500 dark:text-primary-400">
              <span>{mvcProgress}% concluído</span>
              {mvcAvg > 0 && <span>Média: {formatMs(mvcAvg)}</span>}
            </div>
          </div>

          <div className="card p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Wifi className="w-4 h-4 text-emerald-500" />
                <h3 className="font-bold text-primary-900 dark:text-white text-sm">Spring WebFlux</h3>
              </div>
              {currentPhase === 'webflux' && <Activity className="w-4 h-4 text-emerald-500 animate-pulse" />}
              {webfluxResult && <CheckCircle2 className="w-4 h-4 text-success" />}
            </div>
            <div className="w-full bg-primary-200 dark:bg-primary-700 rounded-full h-3 mb-2">
              <div
                className="bg-emerald-500 h-3 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${webfluxProgress}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-primary-500 dark:text-primary-400">
              <span>{webfluxProgress}% concluído</span>
              {webfluxAvg > 0 && <span>Média: {formatMs(webfluxAvg)}</span>}
            </div>
          </div>
        </div>
      )}

      {/* Comparison Results */}
      {hasResults && (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <MetricCard label="Tempo Total" mvcValue={formatMs(mvcResult.totalTimeMs)} wfValue={formatMs(webfluxResult.totalTimeMs)} winner={getWinner(mvcResult.totalTimeMs, webfluxResult.totalTimeMs, true)} icon={Timer} />
            <MetricCard label="Média" mvcValue={formatMs(mvcResult.avgResponseTimeMs)} wfValue={formatMs(webfluxResult.avgResponseTimeMs)} winner={getWinner(mvcResult.avgResponseTimeMs, webfluxResult.avgResponseTimeMs, true)} icon={Clock} />
            <MetricCard label="Throughput" mvcValue={formatThroughput(mvcResult.throughputReqPerSec)} wfValue={formatThroughput(webfluxResult.throughputReqPerSec)} winner={getWinner(mvcResult.throughputReqPerSec, webfluxResult.throughputReqPerSec, false)} icon={TrendingUp} />
            <MetricCard label="P95" mvcValue={formatMs(mvcResult.p95Ms)} wfValue={formatMs(webfluxResult.p95Ms)} winner={getWinner(mvcResult.p95Ms, webfluxResult.p95Ms, true)} icon={Activity} />
            <MetricCard label="Threads Pico" mvcValue={`${mvcResult.peakThreadCount}`} wfValue={`${webfluxResult.peakThreadCount}`} winner={getWinner(mvcResult.peakThreadCount, webfluxResult.peakThreadCount, true)} icon={Cpu} />
            <MetricCard label="Memória" mvcValue={`${mvcResult.memoryUsedMb}MB`} wfValue={`${webfluxResult.memoryUsedMb}MB`} winner={getWinner(mvcResult.memoryUsedMb, webfluxResult.memoryUsedMb, true)} icon={HardDrive} />
          </div>

          {/* Detailed Comparison Table */}
          <div className="card overflow-hidden">
            <div className="p-5 border-b border-primary-200 dark:border-primary-700">
              <h2 className="text-lg font-bold text-primary-900 dark:text-white flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-accent" />
                Comparação Detalhada
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-primary-200 dark:border-primary-700">
                    <th className="text-left py-3 px-5 text-xs font-semibold text-primary-500 uppercase">Métrica</th>
                    <th className="text-center py-3 px-5 text-xs font-semibold text-orange-500 uppercase">
                      <div className="flex items-center justify-center gap-1"><Server className="w-3 h-3" /> Spring MVC</div>
                    </th>
                    <th className="text-center py-3 px-5 text-xs font-semibold text-emerald-500 uppercase">
                      <div className="flex items-center justify-center gap-1"><Wifi className="w-3 h-3" /> WebFlux</div>
                    </th>
                    <th className="text-center py-3 px-5 text-xs font-semibold text-primary-500 uppercase">Vencedor</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-primary-100 dark:divide-primary-800">
                  <ComparisonRow label="Tempo Total" mvc={formatMs(mvcResult.totalTimeMs)} wf={formatMs(webfluxResult.totalTimeMs)} winner={getWinner(mvcResult.totalTimeMs, webfluxResult.totalTimeMs, true)} />
                  <ComparisonRow label="Tempo Médio" mvc={formatMs(mvcResult.avgResponseTimeMs)} wf={formatMs(webfluxResult.avgResponseTimeMs)} winner={getWinner(mvcResult.avgResponseTimeMs, webfluxResult.avgResponseTimeMs, true)} />
                  <ComparisonRow label="Tempo Mínimo" mvc={formatMs(mvcResult.minResponseTimeMs)} wf={formatMs(webfluxResult.minResponseTimeMs)} winner={getWinner(mvcResult.minResponseTimeMs, webfluxResult.minResponseTimeMs, true)} />
                  <ComparisonRow label="Tempo Máximo" mvc={formatMs(mvcResult.maxResponseTimeMs)} wf={formatMs(webfluxResult.maxResponseTimeMs)} winner={getWinner(mvcResult.maxResponseTimeMs, webfluxResult.maxResponseTimeMs, true)} />
                  <ComparisonRow label="Percentil 50 (P50)" mvc={formatMs(mvcResult.p50Ms)} wf={formatMs(webfluxResult.p50Ms)} winner={getWinner(mvcResult.p50Ms, webfluxResult.p50Ms, true)} />
                  <ComparisonRow label="Percentil 95 (P95)" mvc={formatMs(mvcResult.p95Ms)} wf={formatMs(webfluxResult.p95Ms)} winner={getWinner(mvcResult.p95Ms, webfluxResult.p95Ms, true)} />
                  <ComparisonRow label="Percentil 99 (P99)" mvc={formatMs(mvcResult.p99Ms)} wf={formatMs(webfluxResult.p99Ms)} winner={getWinner(mvcResult.p99Ms, webfluxResult.p99Ms, true)} />
                  <ComparisonRow label="Throughput" mvc={formatThroughput(mvcResult.throughputReqPerSec)} wf={formatThroughput(webfluxResult.throughputReqPerSec)} winner={getWinner(mvcResult.throughputReqPerSec, webfluxResult.throughputReqPerSec, false)} />
                  <ComparisonRow label="Sucessos" mvc={`${mvcResult.successCount}/${mvcResult.totalRequests}`} wf={`${webfluxResult.successCount}/${webfluxResult.totalRequests}`} winner="tie" />
                  <ComparisonRow label="Erros" mvc={`${mvcResult.errorCount}`} wf={`${webfluxResult.errorCount}`} winner={getWinner(mvcResult.errorCount, webfluxResult.errorCount, true)} />
                  <ComparisonRow label="Threads Pico" mvc={`${mvcResult.peakThreadCount}`} wf={`${webfluxResult.peakThreadCount}`} winner={getWinner(mvcResult.peakThreadCount, webfluxResult.peakThreadCount, true)} />
                  <ComparisonRow label="Memória Utilizada" mvc={`${mvcResult.memoryUsedMb} MB`} wf={`${webfluxResult.memoryUsedMb} MB`} winner={getWinner(mvcResult.memoryUsedMb, webfluxResult.memoryUsedMb, true)} />
                </tbody>
              </table>
            </div>
          </div>

          {/* Visual Bars Comparison */}
          <div className="card p-5">
            <h2 className="text-lg font-bold text-primary-900 dark:text-white mb-4 flex items-center gap-2">
              <TrendingDown className="w-5 h-5 text-accent" />
              Distribuição de Latência
            </h2>
            <div className="space-y-4">
              <LatencyBar label="P50" mvc={mvcResult.p50Ms} wf={webfluxResult.p50Ms} max={mvcResult.p99Ms || webfluxResult.p99Ms || 100} />
              <LatencyBar label="P95" mvc={mvcResult.p95Ms} wf={webfluxResult.p95Ms} max={mvcResult.p99Ms || webfluxResult.p99Ms || 100} />
              <LatencyBar label="P99" mvc={mvcResult.p99Ms} wf={webfluxResult.p99Ms} max={Math.max(mvcResult.p99Ms, webfluxResult.p99Ms) || 100} />
              <LatencyBar label="Avg" mvc={mvcResult.avgResponseTimeMs} wf={webfluxResult.avgResponseTimeMs} max={Math.max(mvcResult.p99Ms, webfluxResult.p99Ms) || 100} />
            </div>
          </div>

          {/* Analysis Insights */}
          <div className="card p-5">
            <h2 className="text-lg font-bold text-primary-900 dark:text-white mb-3 flex items-center gap-2">
              <Zap className="w-5 h-5 text-accent" />
              Análise dos Resultados
            </h2>
            <div className="space-y-3 text-sm text-primary-600 dark:text-primary-300 leading-relaxed">
              <AnalysisInsight mvc={mvcResult} webflux={webfluxResult} testType={selectedType} />
            </div>
          </div>
        </>
      )}

      {/* Test History */}
      {testHistory.length > 0 && (
        <div className="card overflow-hidden">
          <div className="p-5 border-b border-primary-200 dark:border-primary-700">
            <h2 className="text-lg font-bold text-primary-900 dark:text-white">Histórico de Testes</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-primary-200 dark:border-primary-700">
                  <th className="text-left py-3 px-4 text-xs font-semibold text-primary-500 uppercase">Tipo</th>
                  <th className="text-center py-3 px-4 text-xs font-semibold text-primary-500 uppercase">Req</th>
                  <th className="text-center py-3 px-4 text-xs font-semibold text-orange-500 uppercase">MVC Total</th>
                  <th className="text-center py-3 px-4 text-xs font-semibold text-emerald-500 uppercase">WF Total</th>
                  <th className="text-center py-3 px-4 text-xs font-semibold text-orange-500 uppercase">MVC Avg</th>
                  <th className="text-center py-3 px-4 text-xs font-semibold text-emerald-500 uppercase">WF Avg</th>
                  <th className="text-center py-3 px-4 text-xs font-semibold text-primary-500 uppercase">Venc.</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-primary-100 dark:divide-primary-800">
                {testHistory.map((entry, i) => (
                  <tr key={i} className="hover:bg-primary-50 dark:hover:bg-primary-800 transition-colors">
                    <td className="py-3 px-4 font-medium text-primary-900 dark:text-white">
                      {TEST_TYPES.find((t) => t.type === entry.mvc.testType)?.label || entry.mvc.testType}
                    </td>
                    <td className="py-3 px-4 text-center text-primary-600 dark:text-primary-400">{entry.mvc.totalRequests}</td>
                    <td className="py-3 px-4 text-center text-orange-600 dark:text-orange-400 font-mono">{formatMs(entry.mvc.totalTimeMs)}</td>
                    <td className="py-3 px-4 text-center text-emerald-600 dark:text-emerald-400 font-mono">{formatMs(entry.webflux.totalTimeMs)}</td>
                    <td className="py-3 px-4 text-center text-orange-600 dark:text-orange-400 font-mono">{formatMs(entry.mvc.avgResponseTimeMs)}</td>
                    <td className="py-3 px-4 text-center text-emerald-600 dark:text-emerald-400 font-mono">{formatMs(entry.webflux.avgResponseTimeMs)}</td>
                    <td className="py-3 px-4 text-center">
                      <WinnerBadge winner={getWinner(entry.mvc.totalTimeMs, entry.webflux.totalTimeMs, true)} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

/* Sub-components */

function MetricCard({ label, mvcValue, wfValue, winner, icon: Icon }: {
  label: string; mvcValue: string; wfValue: string; winner: 'mvc' | 'webflux' | 'tie'; icon: typeof Clock;
}) {
  return (
    <div className="card p-4">
      <div className="flex items-center gap-1.5 mb-2">
        <Icon className="w-3.5 h-3.5 text-primary-400" />
        <span className="text-xs font-semibold text-primary-500 dark:text-primary-400 uppercase">{label}</span>
      </div>
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-xs text-orange-500 font-medium">MVC</span>
          <span className={`text-sm font-bold font-mono ${winner === 'mvc' ? 'text-orange-500' : 'text-primary-700 dark:text-primary-300'}`}>{mvcValue}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-emerald-500 font-medium">WF</span>
          <span className={`text-sm font-bold font-mono ${winner === 'webflux' ? 'text-emerald-500' : 'text-primary-700 dark:text-primary-300'}`}>{wfValue}</span>
        </div>
      </div>
      <div className="mt-1.5 pt-1.5 border-t border-primary-100 dark:border-primary-700 text-center">
        <WinnerBadge winner={winner} />
      </div>
    </div>
  );
}

function ComparisonRow({ label, mvc, wf, winner }: {
  label: string; mvc: string; wf: string; winner: 'mvc' | 'webflux' | 'tie';
}) {
  return (
    <tr className="hover:bg-primary-50 dark:hover:bg-primary-800/50 transition-colors">
      <td className="py-3 px-5 font-medium text-primary-900 dark:text-white">{label}</td>
      <td className={`py-3 px-5 text-center font-mono font-semibold ${
        winner === 'mvc' ? 'text-orange-500' : 'text-primary-600 dark:text-primary-400'
      }`}>
        {mvc}
        {winner === 'mvc' && <Trophy className="w-3 h-3 inline ml-1 text-orange-500" />}
      </td>
      <td className={`py-3 px-5 text-center font-mono font-semibold ${
        winner === 'webflux' ? 'text-emerald-500' : 'text-primary-600 dark:text-primary-400'
      }`}>
        {wf}
        {winner === 'webflux' && <Trophy className="w-3 h-3 inline ml-1 text-emerald-500" />}
      </td>
      <td className="py-3 px-5 text-center"><WinnerBadge winner={winner} /></td>
    </tr>
  );
}

function LatencyBar({ label, mvc, wf, max }: {
  label: string; mvc: number; wf: number; max: number;
}) {
  const scale = max > 0 ? 100 / max : 1;
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm font-semibold text-primary-700 dark:text-primary-300">{label}</span>
        <div className="flex gap-4 text-xs font-mono">
          <span className="text-orange-500">MVC: {formatMs(mvc)}</span>
          <span className="text-emerald-500">WF: {formatMs(wf)}</span>
        </div>
      </div>
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-xs text-orange-500 w-8">MVC</span>
          <div className="flex-1 bg-primary-100 dark:bg-primary-700 rounded-full h-2.5">
            <div className="bg-orange-500 h-2.5 rounded-full transition-all duration-500" style={{ width: `${Math.min(100, mvc * scale)}%` }} />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-emerald-500 w-8">WF</span>
          <div className="flex-1 bg-primary-100 dark:bg-primary-700 rounded-full h-2.5">
            <div className="bg-emerald-500 h-2.5 rounded-full transition-all duration-500" style={{ width: `${Math.min(100, wf * scale)}%` }} />
          </div>
        </div>
      </div>
    </div>
  );
}

function AnalysisInsight({ mvc, webflux, testType }: {
  mvc: LoadTestResult; webflux: LoadTestResult; testType: TestType;
}) {
  const mvcFaster = mvc.totalTimeMs < webflux.totalTimeMs;
  const speedup = mvcFaster
    ? ((webflux.totalTimeMs - mvc.totalTimeMs) / webflux.totalTimeMs * 100).toFixed(1)
    : ((mvc.totalTimeMs - webflux.totalTimeMs) / mvc.totalTimeMs * 100).toFixed(1);
  const threadRatio = mvc.peakThreadCount > 0 ? (webflux.peakThreadCount / mvc.peakThreadCount * 100).toFixed(0) : '??';

  const insights: string[] = [];

  if (mvcFaster) {
    insights.push(`O Spring MVC completou o teste ${speedup}% mais rápido que o WebFlux. Isso pode indicar que a carga não é suficientemente alta ou I/O-intensiva para beneficiar o modelo reativo.`);
  } else {
    insights.push(`O Spring WebFlux completou o teste ${speedup}% mais rápido que o MVC. O modelo reativo teve vantagem ao não bloquear threads durante operações de I/O.`);
  }

  insights.push(`O WebFlux utilizou ${threadRatio}% das threads que o MVC precisou no pico (${webflux.peakThreadCount} vs ${mvc.peakThreadCount}). Menos threads significa menor consumo de memória do stack e menor overhead de context-switching.`);

  if (testType === 'io_simulation') {
    insights.push('Em cenários de I/O puro, o WebFlux se destaca porque threads não ficam bloqueadas — Mono.delay() libera a thread imediatamente, enquanto Thread.sleep() mantém a thread ocupada.');
  } else if (testType === 'database_read') {
    insights.push('Em operações de banco de dados, o driver reativo do MongoDB permite que a JVM processe outras requisições enquanto aguarda a resposta do banco, diferente do driver bloqueante que mantém a thread parada.');
  } else if (testType === 'mixed_workload') {
    insights.push('Em cargas mistas (banco + I/O + CPU), o resultado depende da proporção de cada tipo de operação. Operações CPU-bound não se beneficiam do modelo reativo, mas as partes de I/O sim.');
  }

  if (mvc.p99Ms > mvc.avgResponseTimeMs * 3 || webflux.p99Ms > webflux.avgResponseTimeMs * 3) {
    insights.push('A diferença significativa entre a média e o P99 indica que algumas requisições demoraram muito mais que a maioria — um sinal de contenção de recursos ou garbage collection.');
  }

  return (
    <>
      {insights.map((insight, i) => (
        <div key={i} className="flex gap-2">
          <div className="mt-1 flex-shrink-0">
            {i === 0 ? (
              <Trophy className="w-4 h-4 text-accent" />
            ) : (
              <Info className="w-4 h-4 text-primary-400" />
            )}
          </div>
          <p>{insight}</p>
        </div>
      ))}
    </>
  );
}
