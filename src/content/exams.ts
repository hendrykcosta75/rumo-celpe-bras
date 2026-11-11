/**
 * Simulados ORIGINAIS da Parte Escrita, no formato do Celpe-Bras (T1 vídeo, T2 áudio, T3 e T4 leitura).
 * Textos-base, pessoas, números e instituições são fictícios; nenhum trecho foi copiado de provas do Inep.
 */
import type { TaskContext } from "@/lib/grading/grader";

export type TaskKind = "video" | "audio" | "reading";

export interface ExamTask extends TaskContext {
  readonly id: string;
  readonly kind: TaskKind;
  readonly title: string;
  /** Texto-base em português (roteiro narrado no vídeo/áudio ou texto de leitura). */
  readonly sourceText: string;
}

export interface Exam { readonly id: string; readonly title: string; readonly tasks: readonly ExamTask[] }

export const EXAMS: readonly Exam[] = [
  {
    id: "s1",
    title: "Simulado 1",
    tasks: [
      {
        id: "t1", kind: "video", title: "Hortas no meio da cidade",
        sourceText: "Em Campo Verde, no interior de São Paulo, um terreno baldio que juntava lixo virou uma horta comunitária. A ideia partiu de dona Lurdes, aposentada, que convenceu vinte vizinhos a limpar o espaço num mutirão de fim de semana. Hoje são quarenta canteiros, cuidados em sistema de rodízio. Quem trabalha leva verduras para casa, e o que sobra é doado a uma creche do bairro. A prefeitura cedeu o terreno por dez anos e ajuda com água. Segundo os moradores, a horta também diminuiu os assaltos na rua, porque agora há gente circulando o dia todo. O maior desafio é manter os voluntários depois do entusiasmo inicial. Para isso, o grupo criou oficinas para crianças nas manhãs de sábado.",
        statement: "Você mora em um bairro com um terreno abandonado. Depois de assistir à reportagem sobre a horta comunitária de Campo Verde, escreva um e-mail à associação de moradores do seu bairro propondo a criação de uma horta semelhante. Apresente a experiência de Campo Verde e explique como a ideia poderia funcionar no seu bairro.",
        genre: "e-mail", enunciator: "morador(a) do bairro", interlocutor: "diretoria da associação de moradores",
        purpose: "propor a criação de uma horta comunitária, usando a experiência de Campo Verde como argumento",
        keyInfo: ["terreno baldio transformado por mutirão", "40 canteiros em rodízio", "doação do excedente a uma creche", "cessão do terreno pela prefeitura e ajuda com água", "mais segurança na rua", "desafio de manter voluntários; oficinas para crianças"],
      },
      {
        id: "t2", kind: "audio", title: "Pedalar para o trabalho",
        sourceText: "Locutora: No programa de hoje, falamos com o engenheiro de tráfego Paulo Meireles sobre o uso da bicicleta nas cidades brasileiras. Paulo, a bicicleta é uma solução real? Paulo: É uma parte da solução. Em percursos de até cinco quilômetros, ela costuma ser mais rápida que o carro no horário de pico. Mas o ciclista precisa de ciclovias conectadas, e não de pedaços soltos que terminam no meio de uma avenida. Locutora: E o que mais desestimula as pessoas? Paulo: O medo do trânsito, em primeiro lugar. Depois, a falta de lugar seguro para estacionar e de vestiário no trabalho. Empresas que oferecem bicicletário e chuveiro veem o número de funcionários ciclistas dobrar em poucos meses. Locutora: E para quem nunca pedalou na cidade? Paulo: Comece aos fins de semana, em trajetos curtos, e procure grupos de pedal da sua região. Eles ensinam rotas mais tranquilas.",
        statement: "Você trabalha no setor de recursos humanos de uma empresa que quer incentivar os funcionários a irem de bicicleta ao trabalho. Com base no áudio, escreva um texto para o boletim interno da empresa apresentando as vantagens de pedalar, os obstáculos mais comuns e o que a empresa pode oferecer, além de dicas para quem quer começar.",
        genre: "texto para boletim interno de empresa", enunciator: "funcionário(a) do RH", interlocutor: "funcionários da empresa",
        purpose: "incentivar o uso da bicicleta para ir ao trabalho, informando vantagens, obstáculos, apoio da empresa e dicas",
        keyInfo: ["até 5 km a bicicleta é mais rápida no pico", "ciclovias conectadas", "medo do trânsito", "falta de estacionamento e vestiário", "bicicletário e chuveiro dobram o número de ciclistas", "começar aos fins de semana e procurar grupos de pedal"],
      },
      {
        id: "t3", kind: "reading", title: "Trabalho remoto e cidades pequenas",
        sourceText: "Desde que o trabalho remoto se tornou comum, cidades com menos de 50 mil habitantes passaram a receber novos moradores vindos das capitais. Em Serra Alta, em Minas Gerais, a prefeitura calcula que 600 famílias chegaram nos últimos três anos. Os recém-chegados buscam aluguel mais barato, segurança e contato com a natureza. O comércio local agradece: padarias, academias e escolas de idiomas abriram filiais. Mas há efeitos menos positivos. O preço dos aluguéis subiu 35% e muitos moradores antigos, que ganham salários locais, já não conseguem morar no centro. A internet, que melhorou em alguns bairros, continua instável na zona rural. Para a urbanista Carla Nunes, as cidades precisam planejar esse crescimento: \"Sem regras de uso do solo e investimento em infraestrutura, o que era qualidade de vida vira problema\".",
        statement: "Você é moradora(or) antiga(o) de uma cidade pequena que vive situação parecida com a de Serra Alta. Escreva uma carta ao prefeito da sua cidade apresentando os efeitos positivos e negativos da chegada dos novos moradores, com base na reportagem, e sugerindo medidas para que o crescimento seja planejado.",
        genre: "carta aberta ao prefeito", enunciator: "morador(a) antigo(a) da cidade", interlocutor: "prefeito(a) da cidade",
        purpose: "relatar efeitos positivos e negativos da chegada de novos moradores e reivindicar planejamento",
        keyInfo: ["600 famílias em 3 anos", "busca de aluguel barato, segurança e natureza", "comércio local cresceu", "aluguel subiu 35%; antigos moradores saem do centro", "internet instável na zona rural", "urbanista defende regras de uso do solo e infraestrutura"],
      },
      {
        id: "t4", kind: "reading", title: "Celular na sala de aula",
        sourceText: "\"Proibir não é educar\", por Marta Siqueira (artigo de opinião). Várias redes de ensino decidiram proibir o celular nas escolas, inclusive no recreio. Entendo a preocupação: alunos distraídos, conflitos nas redes sociais, menos conversa no pátio. Mas a proibição total esconde o problema em vez de enfrentá-lo. Os mesmos adolescentes passam seis horas por dia no celular fora da escola, e é na escola que deveriam aprender a usá-lo com responsabilidade: checar uma notícia, proteger dados pessoais, fazer uma pesquisa séria. Defendo regras claras, combinadas com os alunos, para momentos de uso e de desconexão. A escola não pode ser uma bolha fora do mundo em que os jovens vivem.",
        statement: "Depois de ler o artigo de Marta Siqueira, você decidiu escrever um texto para a seção \"Opinião do leitor\" do jornal, posicionando-se em relação às questões levantadas pela autora.",
        genre: "carta do leitor / texto de opinião do leitor", enunciator: "leitor(a) do jornal", interlocutor: "leitores do jornal e a autora do artigo",
        purpose: "posicionar-se, com argumentos próprios, sobre a proibição do celular nas escolas discutida pela autora",
        keyInfo: ["redes de ensino proibindo o celular, até no recreio", "preocupações: distração, conflitos, menos conversa", "autora: proibição esconde o problema", "escola deveria ensinar uso responsável", "proposta de regras combinadas para uso e desconexão"],
      },
    ],
  },
  {
    id: "s2",
    title: "Simulado 2",
    tasks: [
      {
        id: "t1", kind: "video", title: "Festa junina e economia local",
        sourceText: "Em junho, a cidade de Riacho Doce, na Paraíba, quase dobra de tamanho. Os festejos de São João atraem visitantes de todo o país para ver as quadrilhas, provar comidas de milho e dançar forró até de madrugada. Para os comerciantes, é a melhor época do ano: uma barraca de canjica pode faturar em um mês o que ganha em seis. Costureiras passam o ano preparando roupas para as quadrilhas, e músicos locais têm agenda cheia. Nos últimos anos, porém, grandes shows com artistas famosos ganharam espaço, e alguns moradores reclamam que o forró tradicional está ficando em segundo plano. A prefeitura diz que reservou dois palcos só para trios de forró pé de serra e que 70% das barracas são de moradores.",
        statement: "Você trabalha em uma agência de turismo e foi encarregado(a) de escrever um texto para o blog da agência apresentando o São João de Riacho Doce a turistas estrangeiros. Com base no vídeo, apresente a festa, sua importância para a economia da cidade e o debate sobre a tradição.",
        genre: "post de blog de agência de turismo", enunciator: "funcionário(a) da agência de turismo", interlocutor: "turistas estrangeiros leitores do blog",
        purpose: "apresentar e promover a festa, informando sua importância econômica e o debate sobre tradição",
        keyInfo: ["cidade quase dobra em junho", "quadrilhas, comidas de milho, forró", "barraca fatura em 1 mês o que ganha em 6", "costureiras e músicos locais", "grandes shows x forró tradicional", "dois palcos para forró pé de serra; 70% das barracas de moradores"],
      },
      {
        id: "t2", kind: "audio", title: "Doar sangue",
        sourceText: "Locutor: O estoque dos hemocentros costuma cair nas férias e no carnaval. Para falar disso, conversamos com a enfermeira Juliana Prado. Juliana, quem pode doar? Juliana: Pessoas de 16 a 69 anos, com mais de 50 quilos e em boas condições de saúde. Quem tem menos de 18 anos precisa de autorização dos pais. Locutor: E como é a doação? Juliana: Leva cerca de quarenta minutos no total. A pessoa faz um cadastro, uma entrevista rápida e um teste de anemia. A coleta em si dura uns dez minutos. Depois, recebe um lanche. Locutor: Alguma recomendação? Juliana: Não doar em jejum, evitar comida gordurosa nas quatro horas anteriores e dormir bem. E não beber álcool no dia anterior. Uma única doação pode ajudar até quatro pessoas.",
        statement: "Você faz parte do grêmio estudantil de uma universidade e vai organizar uma campanha de doação de sangue. Com base no áudio, escreva um cartaz-convite para ser afixado nos murais da universidade, convidando os estudantes a doar e informando quem pode doar, como funciona a doação e os cuidados necessários.",
        genre: "cartaz / convite de campanha", enunciator: "membro do grêmio estudantil", interlocutor: "estudantes da universidade",
        purpose: "convencer os estudantes a doar sangue e informar requisitos, etapas e cuidados",
        keyInfo: ["estoques caem em férias e carnaval", "16 a 69 anos, mais de 50 kg; menores com autorização", "cerca de 40 min; coleta de 10 min; lanche", "não ir em jejum, evitar gordura 4 h antes, dormir bem, sem álcool na véspera", "uma doação ajuda até 4 pessoas"],
      },
      {
        id: "t3", kind: "reading", title: "Bibliotecas que nascem na comunidade",
        sourceText: "No Morro do Sol, em Salvador, uma garagem virou a Biblioteca Comunitária Palavra Viva. Criada por três jovens em 2019 com 200 livros doados, ela tem hoje 6 mil títulos, clube de leitura para adolescentes e aulas de reforço escolar. Não há bibliotecária contratada: os voluntários se revezam para abrir o espaço todos os dias à tarde. Segundo a coordenadora, Tainá Ribeiro, as crianças que frequentam o espaço melhoraram as notas de português, e algumas famílias passaram a ler juntas em casa. A biblioteca sobrevive de doações e de uma rifa anual. Os maiores problemas são o mofo, que já estragou centenas de livros, e a falta de computadores para pesquisa.",
        statement: "Você é voluntário(a) da Biblioteca Comunitária Palavra Viva. Escreva um e-mail a uma livraria da cidade pedindo apoio para a biblioteca. Apresente o projeto, os resultados alcançados e as necessidades atuais, explicando de que forma a livraria poderia ajudar.",
        genre: "e-mail de solicitação de apoio", enunciator: "voluntário(a) da biblioteca", interlocutor: "gerência de uma livraria",
        purpose: "pedir apoio, apresentando o projeto, os resultados e as necessidades",
        keyInfo: ["garagem virou biblioteca em 2019 com 200 livros", "hoje 6 mil títulos, clube de leitura e reforço", "voluntários abrem todas as tardes", "melhora nas notas e leitura em família", "doações e rifa anual", "mofo e falta de computadores"],
      },
      {
        id: "t4", kind: "reading", title: "Ônibus de graça?",
        sourceText: "\"Tarifa zero é investimento\", por Ricardo Amaral (artigo de opinião). Mais de cem cidades brasileiras já adotaram ônibus gratuitos. Os resultados chamam atenção: o número de passageiros cresce, o comércio do centro vende mais e famílias pobres economizam até 15% da renda. Os críticos dizem que alguém sempre paga a conta. É verdade: o custo sai do orçamento municipal ou de uma taxa cobrada das empresas. Mas a pergunta certa não é se custa, e sim quanto a cidade ganha. Menos carros significam menos acidentes e menos poluição. Transporte não deveria ser tratado como mercadoria, e sim como um direito, assim como a escola e o posto de saúde.",
        statement: "Depois de ler o artigo de Ricardo Amaral, você decidiu escrever para a seção \"Cartas do Leitor\" do jornal, defendendo seu ponto de vista sobre a tarifa zero no transporte público.",
        genre: "carta do leitor", enunciator: "leitor(a) do jornal", interlocutor: "leitores do jornal / o autor do artigo",
        purpose: "defender um ponto de vista próprio sobre a tarifa zero, dialogando com os argumentos do autor",
        keyInfo: ["mais de cem cidades com tarifa zero", "mais passageiros, comércio do centro vende mais, economia de até 15% da renda", "custo sai do orçamento ou de taxa das empresas", "menos carros, acidentes e poluição", "transporte como direito"],
      },
    ],
  },
  {
    id: "s3",
    title: "Simulado 3",
    tasks: [
      {
        id: "t1", kind: "video", title: "Turismo nas comunidades da Amazônia",
        sourceText: "Às margens do rio Tapajós, a comunidade ribeirinha de Boa Esperança recebe turistas desde 2017. Os visitantes dormem em redes, pescam com os moradores e aprendem a fazer farinha de mandioca. Todo o dinheiro fica na comunidade: uma parte paga quem trabalha com os turistas, outra vai para um fundo usado na escola e no posto de saúde. O número de visitantes é limitado a doze por semana, para não prejudicar a rotina e a natureza. Os jovens, que antes saíam para procurar emprego na cidade, agora trabalham como guias. O líder comunitário, seu Raimundo, diz que o mais importante é mostrar que é possível ganhar dinheiro sem derrubar a floresta.",
        statement: "Você escreve para uma revista de viagens. Com base no vídeo, escreva uma reportagem sobre o turismo de base comunitária em Boa Esperança, apresentando a experiência dos visitantes e os benefícios para os moradores e para a floresta.",
        genre: "reportagem de revista de viagens", enunciator: "jornalista da revista", interlocutor: "leitores da revista de viagens",
        purpose: "informar e despertar interesse pelo turismo de base comunitária, mostrando benefícios",
        keyInfo: ["comunidade no rio Tapajós desde 2017", "redes, pesca, farinha de mandioca", "dinheiro fica na comunidade; fundo para escola e posto", "limite de 12 visitantes por semana", "jovens viram guias", "ganhar dinheiro sem derrubar a floresta"],
      },
      {
        id: "t2", kind: "audio", title: "Comida de verdade",
        sourceText: "Apresentadora: Biscoitos recheados, refrigerantes, salsichas e macarrão instantâneo estão cada vez mais presentes na mesa dos brasileiros. A nutricionista Fernanda Lopes explica o que são os alimentos ultraprocessados. Fernanda: São produtos feitos em fábrica com muitos ingredientes que não usamos na cozinha de casa, como corantes e aromatizantes. Eles costumam ter muito açúcar, sal e gordura. Apresentadora: E qual é o problema? Fernanda: O consumo frequente está ligado à obesidade, ao diabetes e à pressão alta. E eles enganam a fome: comemos mais do que precisamos. Apresentadora: Como mudar sem gastar muito? Fernanda: Arroz, feijão, ovos, frutas e legumes da estação continuam baratos. Planejar o cardápio da semana e cozinhar em maior quantidade ajuda muito. E leia os rótulos: lista de ingredientes muito longa é sinal de alerta.",
        statement: "Você é síndico(a) de um condomínio e vai organizar uma semana de alimentação saudável. Com base no áudio, escreva um texto informativo para o mural do condomínio explicando o que são alimentos ultraprocessados, por que evitá-los e como ter uma alimentação mais saudável sem gastar muito.",
        genre: "texto informativo para mural de condomínio", enunciator: "síndico(a)", interlocutor: "moradores do condomínio",
        purpose: "informar e orientar os moradores sobre ultraprocessados e alimentação saudável barata",
        keyInfo: ["definição: feitos em fábrica com ingredientes que não usamos em casa", "muito açúcar, sal e gordura", "ligados a obesidade, diabetes e pressão alta; enganam a fome", "arroz, feijão, ovos, frutas e legumes da estação são baratos", "planejar cardápio e cozinhar em quantidade", "ler rótulos"],
      },
      {
        id: "t3", kind: "reading", title: "Quem cuida de quem cuida",
        sourceText: "O Brasil tem hoje mais de 30 milhões de pessoas com mais de 60 anos, e muitas precisam de ajuda diária. Na maioria dos casos, quem cuida é uma filha ou esposa, sem salário e sem preparo. Uma pesquisa com 1.200 cuidadores familiares mostrou que 60% dormem menos de seis horas por noite e metade deixou o emprego para cuidar do parente. Ansiedade e dores nas costas são frequentes. Algumas cidades criaram centros-dia, onde os idosos passam o dia com atividades e acompanhamento, e grupos de apoio para os cuidadores. Especialistas defendem também que as empresas ofereçam horários flexíveis para funcionários que cuidam de pais idosos.",
        statement: "Você trabalha em uma empresa e cuida de seu pai idoso. Depois de ler a reportagem, escreva um e-mail ao setor de recursos humanos relatando a situação dos cuidadores familiares e propondo medidas que a empresa poderia adotar para apoiar funcionários nessa condição.",
        genre: "e-mail ao RH", enunciator: "funcionário(a) que cuida do pai idoso", interlocutor: "setor de recursos humanos da empresa",
        purpose: "sensibilizar o RH sobre a situação dos cuidadores e propor medidas de apoio",
        keyInfo: ["mais de 30 milhões de idosos", "cuidadoras familiares sem salário e sem preparo", "60% dormem menos de 6 h; metade deixou o emprego", "ansiedade e dores", "centros-dia e grupos de apoio", "horários flexíveis nas empresas"],
      },
      {
        id: "t4", kind: "reading", title: "Entregadores por aplicativo",
        sourceText: "\"A liberdade que não paga as contas\", por Daniel Costa (artigo de opinião). Os aplicativos de entrega vendem a ideia de que o entregador é seu próprio patrão: escolhe quando e quanto trabalhar. Na prática, para ganhar um salário mínimo, muitos rodam mais de dez horas por dia, sem descanso semanal, sem seguro em caso de acidente e pagando a própria moto e o combustível. As empresas dizem que são apenas intermediárias e que um vínculo formal acabaria com a flexibilidade. Não precisa ser assim. É possível garantir um valor mínimo por hora trabalhada, seguro e contribuição para a aposentadoria sem acabar com os aplicativos. Quem pede comida em casa também tem responsabilidade nessa conversa.",
        statement: "Depois de ler o artigo de Daniel Costa, escreva um texto de opinião para o blog de um coletivo de consumidores, posicionando-se sobre a situação dos entregadores por aplicativo e sobre o papel de quem usa esses serviços.",
        genre: "texto de opinião para blog", enunciator: "membro de um coletivo de consumidores", interlocutor: "leitores do blog (consumidores)",
        purpose: "posicionar-se sobre o trabalho dos entregadores e a responsabilidade dos consumidores",
        keyInfo: ["discurso do 'próprio patrão'", "mais de 10 h por dia para ganhar um mínimo", "sem descanso, sem seguro, custos da moto e combustível", "empresas dizem ser intermediárias", "proposta: valor mínimo por hora, seguro e aposentadoria", "responsabilidade de quem pede"],
      },
    ],
  },
  {
    id: "s4",
    title: "Simulado 4",
    tasks: [
      {
        id: "t1", kind: "video", title: "Praias sem plástico",
        sourceText: "Num sábado de manhã, cento e cinquenta voluntários se espalharam pela praia de Ponta Clara, no litoral de Santa Catarina. Em três horas, recolheram quase meia tonelada de lixo. A maior parte era plástico: tampinhas, canudos, sacolas e bitucas de cigarro. A bióloga Renata Kuhn, que organiza o mutirão uma vez por mês, explica que o plástico se quebra em pedaços minúsculos que são engolidos por peixes e tartarugas. O lixo recolhido é separado e pesado, e os dados são enviados a uma universidade que estuda a poluição no litoral. Restaurantes da orla já trocaram os canudos de plástico por canudos de papel, depois de uma campanha do grupo.",
        statement: "Você faz parte do grupo de voluntários de Ponta Clara. Com base no vídeo, escreva uma publicação para a página do grupo numa rede social convidando as pessoas para o próximo mutirão, explicando o problema do plástico nas praias e mostrando os resultados já alcançados.",
        genre: "publicação em rede social (convite)", enunciator: "voluntário(a) do grupo", interlocutor: "seguidores da página e público em geral",
        purpose: "convidar para o mutirão, informando o problema e os resultados",
        keyInfo: ["150 voluntários, 3 horas, quase meia tonelada", "maioria plástico: tampinhas, canudos, sacolas, bitucas", "microplástico engolido por peixes e tartarugas", "lixo separado e pesado; dados para universidade", "mutirão mensal", "restaurantes trocaram canudos"],
      },
      {
        id: "t2", kind: "audio", title: "Golpes pelo celular",
        sourceText: "Locutor: Os golpes pelo celular não param de crescer. Recebemos hoje o delegado Marcos Teixeira. Delegado, quais são os mais comuns? Marcos: O do falso parente: a pessoa recebe uma mensagem de um número desconhecido dizendo \"mãe, troquei de número\" e logo vem um pedido de transferência urgente. Outro é o do falso funcionário de banco, que liga dizendo que houve uma compra suspeita e pede senhas ou códigos. Locutor: Como se proteger? Marcos: Nunca passe códigos recebidos por mensagem. Se um parente pedir dinheiro, ligue para o número antigo dele ou faça uma pergunta que só ele saberia. Banco não pede senha por telefone. E ative a verificação em duas etapas no aplicativo de mensagens. Locutor: E quem caiu no golpe? Marcos: Avise o banco imediatamente e registre um boletim de ocorrência.",
        statement: "Você é voluntário(a) de uma associação de aposentados. Com base no áudio, escreva um texto de alerta para o informativo mensal da associação, explicando os golpes mais comuns pelo celular, como se proteger e o que fazer em caso de golpe.",
        genre: "texto de alerta para informativo", enunciator: "voluntário(a) da associação", interlocutor: "associados aposentados",
        purpose: "alertar e orientar sobre golpes pelo celular",
        keyInfo: ["golpe do falso parente ('troquei de número') com pedido urgente", "falso funcionário de banco pedindo senhas/códigos", "nunca passar códigos", "ligar para o número antigo ou pergunta pessoal", "banco não pede senha", "verificação em duas etapas", "avisar o banco e registrar boletim de ocorrência"],
      },
      {
        id: "t3", kind: "reading", title: "Diploma estrangeiro no Brasil",
        sourceText: "Estrangeiros e brasileiros que estudaram fora precisam revalidar o diploma para exercer várias profissões no Brasil. O processo é feito por universidades públicas e pode levar de seis meses a mais de um ano. Desde 2016, uma plataforma on-line reúne os pedidos, e universidades credenciadas analisam documentos como histórico escolar, programa das disciplinas e diploma, todos traduzidos por tradutor juramentado. Em algumas áreas, como Medicina, há uma prova específica. Os custos variam muito entre instituições. Associações de imigrantes reclamam da demora e da falta de informação em outras línguas, e pedem que o processo seja mais transparente.",
        statement: "Você é imigrante no Brasil e quer revalidar seu diploma. Depois de ler o texto, escreva um e-mail à secretaria de uma universidade pública pedindo informações sobre o processo. Mostre o que você já sabe, explique sua situação e apresente suas dúvidas.",
        genre: "e-mail de pedido de informações", enunciator: "imigrante com diploma estrangeiro", interlocutor: "secretaria de universidade pública",
        purpose: "pedir informações sobre a revalidação, mostrando conhecimento prévio e situação pessoal",
        keyInfo: ["revalidação por universidades públicas", "6 meses a mais de 1 ano", "plataforma on-line desde 2016", "documentos com tradução juramentada", "prova em áreas como Medicina", "custos variam; reclamação de demora e falta de informação em outras línguas"],
      },
      {
        id: "t4", kind: "reading", title: "Semana de quatro dias",
        sourceText: "\"Trabalhar menos para produzir mais?\", por Helena Duarte (artigo de opinião). Empresas de vários países testaram a semana de quatro dias, sem redução de salário, e muitas decidiram mantê-la. Os funcionários relatam menos estresse e mais tempo com a família, e as empresas, menos faltas. Mas é preciso cuidado com o entusiasmo. O modelo funciona melhor em escritórios do que em hospitais, fábricas ou no comércio, que precisam de gente todos os dias. No Brasil, onde muitos trabalhadores ainda estão na informalidade, a discussão pode parecer distante. Talvez o primeiro passo seja respeitar a jornada que já existe e acabar com as horas extras não pagas.",
        statement: "Depois de ler o artigo de Helena Duarte, você decidiu escrever para a seção \"Cartas do Leitor\" do jornal, posicionando-se sobre a semana de trabalho de quatro dias no Brasil.",
        genre: "carta do leitor", enunciator: "leitor(a) do jornal", interlocutor: "leitores do jornal / a autora do artigo",
        purpose: "defender um ponto de vista sobre a semana de quatro dias no Brasil, dialogando com a autora",
        keyInfo: ["testes em vários países, sem redução de salário", "menos estresse, mais tempo com a família, menos faltas", "funciona melhor em escritórios", "informalidade no Brasil", "respeitar a jornada e acabar com horas extras não pagas"],
      },
    ],
  },
];

/** Tarefa curta do diagnóstico grátis (leitura). */
export const DIAGNOSTIC_TASK: ExamTask = {
  id: "diag", kind: "reading", title: "Pets no condomínio",
  sourceText: "Uma nova regra do Condomínio Jardim das Flores proíbe que cachorros circulem pelos elevadores sociais e pelo jardim. A administração explica que recebeu reclamações sobre sujeira e latidos. Os donos de animais, que somam 45 dos 120 apartamentos, dizem que a regra é exagerada e que a maioria recolhe a sujeira dos pets. Uma advogada consultada lembra que o condomínio pode criar regras de convivência, mas não pode impedir que um morador tenha animal em casa. Ela sugere soluções intermediárias, como horários para os pets no jardim e uso do elevador de serviço.",
  statement: "Você mora no Condomínio Jardim das Flores. Depois de ler a notícia, escreva uma mensagem ao síndico posicionando-se sobre a nova regra e propondo uma solução que considere os interesses de todos os moradores.",
  genre: "mensagem/carta ao síndico", enunciator: "morador(a) do condomínio", interlocutor: "síndico(a)",
  purpose: "posicionar-se sobre a regra e propor uma solução conciliadora",
  keyInfo: ["proibição de cães nos elevadores sociais e no jardim", "reclamações de sujeira e latidos", "45 de 120 apartamentos têm animais", "condomínio pode regular a convivência, mas não proibir animais", "soluções intermediárias: horários e elevador de serviço"],
};

export function findTask(examId: string, taskId: string): ExamTask | undefined {
  return EXAMS.find(e => e.id === examId)?.tasks.find(t => t.id === taskId);
}

/** Temas do treino de fala (inspirados nos elementos provocadores da Parte Oral; originais). */
export const SPEAKING_TOPICS: readonly { id: string; title: string; prompt: string }[] = [
  { id: "f1", title: "Cidade ideal", prompt: "Descreva como seria a cidade ideal para você morar no Brasil. O que ela precisa ter? Compare com a cidade onde você mora hoje." },
  { id: "f2", title: "Trabalho e família", prompt: "Muitas pessoas dizem que não têm tempo para a família por causa do trabalho. Isso acontece no seu país? O que poderia mudar?" },
  { id: "f3", title: "Redes sociais", prompt: "As redes sociais aproximam ou afastam as pessoas? Dê exemplos da sua experiência." },
  { id: "f4", title: "Aprender português", prompt: "Conte como foi aprender português até agora: o que foi mais difícil, o que ajudou e o que você ainda quer melhorar." },
  { id: "f5", title: "Meio ambiente", prompt: "Que atitudes do dia a dia ajudam o meio ambiente? Você acha que as pessoas fazem a sua parte ou que a responsabilidade é dos governos e das empresas?" },
  { id: "f6", title: "Festas e tradições", prompt: "Fale de uma festa tradicional do seu país e compare com uma festa brasileira que você conhece." },
];
