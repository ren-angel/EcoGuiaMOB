import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TextInput, StyleSheet, Image, ActivityIndicator, TouchableOpacity, Modal, Dimensions, Pressable, Alert } from 'react-native';
import { TitleTrilha, PointNone, PointDone } from '../assets';
import { useFonts, Poppins_400Regular, Poppins_500Medium, Poppins_600SemiBold } from '@expo-google-fonts/poppins';
import { RefreshControl } from 'react-native-gesture-handler';
import api from '../services/api';
import cache from '../utils/cache';
import getPerfil from '../utils/gerProfile';

const Trilha = () => {
	const [modalMateriaisVisivel, setModalMateriaisVisivel] = useState(false);
	const [modalQuantidadeVisivel, setModalQuantidadeVisivel] = useState(false);
	const [materialSelecionado, setMaterialSelecionado] = useState(null);
	const [quantidade, setQuantidade] = useState(1);
	const [materiais,setMateriais] = useState([])

  const getMateriais = async  () =>{
	  try{
		  const response = await api.get('/materiais')
		  setMateriais(response.data.materiais)
	  }catch(error){
		console.error("Erro ao buscar os materiais "+error)
	  }
  }
  let materiaisDisponiveis;
   if(materiais[0]){
	 materiaisDisponiveis = [
		{ nome: materiais[0].title_material, xp: materiais[0].XP_material, cor: '#3787D4' }, 
		{ nome: materiais[1].title_material, xp: materiais[1].XP_material, cor: '#DB3030' }, 
		{ nome: materiais[2].title_material, xp: materiais[2].XP_material, cor: '#6BBF59' }, 
		{ nome: materiais[3].title_material, xp: materiais[3].XP_material, cor: '#DABC46' }, 
		{ nome: materiais[4].title_material, xp: materiais[4].XP_material, cor: '#E09B6E' }, 
	];

}

	const abrirModalQuantidade = (material) => {
		setMaterialSelecionado(material);
		setModalQuantidadeVisivel(true);
	};

	const handleQuantidadeChange = (text) => {
		const valor = parseFloat(text);
		if (!isNaN(valor) && valor > 0) {
			setQuantidade(valor);
		} else if (text === '') {
			setQuantidade('');
		}
	};
	
	const [selectedQuest, setSelectedQuest] = useState(null);
	
	const windowHeight = Dimensions.get('window').height;
	
	// Trazer dados das quests
	const [quests, setQuests] = useState('');
	const [questUser, setQuestUser] = useState('');
	
	const loadQuests = async () => {
		try {
			const response = await api.get('/quests');
			setQuests(response.data.quests)
			const quest = await cache.get('dados')
			setQuestUser(quest.pk_IDquest)
		} catch(error) {
			Alert.alert("Erro ao buscar as missões: ", error.response.msg)
			console.error(error)
		}
	}

	// Setar como useEffect
	useEffect(() => {
		 loadQuests();
		 getMateriais();
	}, []);

	// Reloading das páginas 
	const [refresh, setRefresh]  = useState(false)
	const onRefresh = async () => {
    setRefresh(true)
	await getPerfil()
    await loadQuests()
	setTimeout(() =>{
		setRefresh(false)  
	  },2000) 
	};

	// Função modal de concluir quest
	const concluirObjetivo = async () => {
		//capta o tokenID do cachê
		const tokenID  = await cache.get('tokenID')
		onRefresh()
		//chama a função de atualizar level que atualiza o ID de missão
		try {
			const data = await api.put(
				'/user/levelup', 
				{ type: 0, xp_material: null, peso: null }, 
				{ headers: { Authorization: `Bearer ${tokenID}` } }
			);
			const response = data.data.msg;

			//switch para verificar o que foi retornado
			switch (response.status) {
				case 200:
				// reload das quests
				setDummyState(Date.now());
				break;
				}

		} catch(error) {
			// Se houver erro, verifica se é um erro de resposta
			if (error.response) {
				const status = error.response.status;
				const msg = error.response.data.msg;
				
				// Tratando erros com base no status
				switch (status) {
					case 500:
						showModal(msg);
					break;
						
					default:
						showModal('Algo deu errado :(',  'Ocorreu um erro desconhecido. Tente novamente');
						console.error('Erro no back-end:', response);
				}	
			} else if (error.request) {
				// Se houver falha na requisição sem resposta do servidor
				showModal('Erro de conexão', 'Sem resposta do servidor. Verifique sua conexão');
			} else {
				// Outros tipos de erro (como erros de configuração)
				showModal('Erro', 'Erro desconhecido');
				console.error('Erro na requisição:', error);
			}
		} finally {
			// Fechar modal ao apertar botão de concluído
			setSelectedQuest(null);						
		};
	};

	const [xpMaterial,setXpMaterial] = useState('')
		// Função modal de concluir quest
		const concluirColeta = async () => {
			//capta o tokenID do cachê
			const tokenID  = await cache.get('tokenID')
			onRefresh()
			//chama a função de atualizar level que atualiza o ID de missão
			try {
				const data = await api.put(
					'/user/levelup', 
					{ type: 1, xp_material: xpMaterial, peso: quantidade }, 
					{ headers: { Authorization: `Bearer ${tokenID}` } }
				);
				const response = data.data.msg;
	
				//switch para verificar o que foi retornado
				switch (response.status) {
					case 200:
					// reload das quests
				alert("XP adicionado com sucesso!")
					}
	
			} catch(error) {
				// Se houver erro, verifica se é um erro de resposta
				if (error.response) {
					const status = error.response.status;
					const msg = error.response.data.msg;
					
					// Tratando erros com base no status
					switch (status) {
						case 500:
							showModal(msg);
						break;
							
						default:
							showModal('Algo deu errado :(',  'Ocorreu um erro desconhecido. Tente novamente');
							console.error('Erro no back-end:', response);
					}	
				} else if (error.request) {
					// Se houver falha na requisição sem resposta do servidor
					showModal('Erro de conexão', 'Sem resposta do servidor. Verifique sua conexão');
				} else {
					// Outros tipos de erro (como erros de configuração)
					showModal('Erro', 'Erro desconhecido');
					console.error('Erro na requisição:', error);
				}
			} finally {
				// Fechar modal ao apertar botão de concluído
				setModalQuantidadeVisivel(false)						
			};
		};

	// Carregamento das fontes
	const [fontsLoaded] = useFonts({
		Poppins_400Regular,
		Poppins_500Medium,
		Poppins_600SemiBold,
	});

	if (!fontsLoaded) {
		return (
			<ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
		);
	}

	return (
		<View style={styles.container}>
			 {/* Flatlist para listagem de missões */}
			 <FlatList
					data={quests} // base de dados da flatlist
					showsVerticalScrollIndicator={false} //scroll invisivel
					contentContainerStyle={styles.content} //estilo
					refreshControl={  //reload da página
						<RefreshControl refreshing={refresh} onRefresh={onRefresh} />}
					ListHeaderComponent={ //header
						<View style={{justifyContent: "center", alignItems: "center"}}>
							<TitleTrilha maxWidth={210} style={{marginBottom: -40, marginTop: -20}}/>
							<Text style={styles.text}>Complete as missões abaixo para desbloquear badges e ganhar xp!</Text>
						</View>
					}
					renderItem={({ item, index }) => {
						const paddingLeft = index % 2 === 0 ? 50 : 270;
						const nextQuest = quests[index + 1];

						return (
						<View>
							{/* Estrutura para setar quest como concluída ou não */}
								{item.pk_IDquest < questUser ? 
								// Quests completas
								<View style={{paddingLeft}}>
									<Pressable onPress={() => setSelectedQuest(item)} style={styles.missaoButton}>
										<PointDone width={70} height={70}/>
									</Pressable>
								</View>
								// Quests incompletas
								 : 
								 <View style={{paddingLeft}}>
								<Pressable onPress={() => setSelectedQuest(item)} style={styles.missaoButton}>
									<PointNone width={70} height={70}/>
								</Pressable>
								</View>
							}

              {/* Linha de progressão */}
              {nextQuest && (
                <View
                  style={[styles.line,
                    {left: index % 2 === 0 ? paddingLeft + 140 : paddingLeft - 70,
                      top: 10, // Ajuste para começar da borda do ponto
                      transform: [{ rotate: index % 2 === 0 ? '-65deg' : '65deg' }],
                    },
                  ]}
                />
              )}

          {/* Aparecer badge a cada 3 quests */}
          {index % 3 === 2 && (
            <View style={styles.contentBadge}>
				{item.pk_IDquest < questUser ?
					<View >
						<Text style={styles.badgeTitle}>{item.title_badge}</Text>
						<Text style={styles.badgeStateA}>Badge concluída!</Text>
						<Text style={styles.badgeDescription}>{item.description_badge}</Text>
					</View>
						:
					<View>
						<Text style={styles.badgeTitle}>{item.title_badge}</Text>
						<Text style={styles.badgeState}>Badge bloqueada!</Text>
						<Text style={styles.badgeDescription}>Complete mais missões para desbloquear essa badge</Text>
					</View>
				}
				<Image
                	style={styles.badgeImg}
                	source={{
                  	uri: `${item.blob_badge}`,
                }}/>
            </View>
          )}
							{/* Modal de visualização das missões */}
							<Modal
								animationType="fade"
								transparent={true}
								visible={selectedQuest?.pk_IDquest === item.pk_IDquest}
								onPress={() => setSelectedQuest(null)}
							>
								<Pressable 
									style={styles.modalBackdrop} 
									onPress={() => setSelectedQuest(null)} // Fecha o modal quando clicado fora do conteúdo
								>
									<View style={styles.modalContent}>
										<Text style={styles.subtitle}>Missão {item.pk_IDquest}</Text>
										<Text style={styles.text}>{item.description_quest}</Text>

										{item.pk_IDquest < questUser ? (
											// Missão já feita
											<Text style={styles.textCompleted}>Missão concluída, parabéns!</Text>

										) : item.pk_IDquest == questUser ? (
											// Missão atual a ser feita
											<TouchableOpacity style={styles.botaoCheck} onPress={concluirObjetivo}>
												<Text style={styles.textBotao}>Concluir</Text>
												<Text style={styles.textBotao}>+{item.XP_quest} XP</Text>
											</TouchableOpacity>
										) : (
											// Próximas missões
											<Text style={styles.textCompleted}>Complete a anterior</Text>
										)}
								</View>
								</Pressable>
							</Modal>
						</View>
					) }}
					keyExtractor={(item) => item.pk_IDquest}
				/>

			{/* Botão Flutuante */}
			<TouchableOpacity
				style={styles.botaoFlutuante}
				onPress={() => setModalMateriaisVisivel(true)}
			>
				<Text style={styles.textoBotao}>+</Text>
			</TouchableOpacity>

			{/* Modal de Seleção de Materiais */}
			<Modal
				visible={modalMateriaisVisivel}
				transparent={true}  
				animationType="slide"
			>
				<Pressable
					style={styles.overlay} 
					onPress={() => setModalMateriaisVisivel(false)}
				>
					<View style={styles.modalContainer}>
						<Text style={styles.titulo}>Selecione os materiais</Text>
						<Text style={styles.subtitulo}>
							Selecione os materiais que fazem parte desta coleta
						</Text>
						<FlatList
							data={materiaisDisponiveis}
							keyExtractor={(item) => item.nome}
							numColumns={2}
							columnWrapperStyle={styles.colunaMateriais}
							contentContainerStyle={styles.listaMateriais}
							renderItem={({ item }) => (
								<TouchableOpacity
									style={[styles.botaoMaterial, { backgroundColor: item.cor }]}
									onPress={() => [abrirModalQuantidade(item), setXpMaterial(item.xp)]} //AQUI
								>
									<Text style={styles.textoMaterial}>{item.nome}</Text>
									<View style={styles.bolhaXp}>
										<Text style={styles.textoXp}>{item.xp}XP</Text>
									</View>
								</TouchableOpacity>
							)}
						/>
					</View>
				</Pressable>
			</Modal>

			{/* Modal de Quantidade */}
			<Modal
	visible={modalQuantidadeVisivel}
	transparent={true} 
	animationType="fade"
>
	<Pressable
		style={styles.overlay}  
		onPress={() => setModalQuantidadeVisivel(false)}
	>
		<View style={styles.modalQuantidade}>

			<View style={styles.inputmaterial}>
				<Text style={styles.textoMaterialSelecionado}>{materialSelecionado?.nome}</Text>

				<View style={styles.controleQuantidade}>
					<TouchableOpacity
						style={styles.botaoControle}
						onPress={() => setQuantidade(quantidade - 0.5,0)}
					>
						<Text style={styles.textoControle}>-</Text>
					</TouchableOpacity>

					{/* Campo de entrada para quantidade com unidade de medida "kg" */}
					<View style={styles.quantidadeContainer}>
						<TextInput
							style={styles.textoQuantidade}
							value={quantidade.toString()}
							onChangeText={handleQuantidadeChange}
							keyboardType="numeric"
						/>
						<Text style={styles.textoQuantidade}>kg</Text>
					</View>

					<TouchableOpacity
						style={styles.botaoControle}
						onPress={() => setQuantidade(quantidade + 0.5,0)}
					>
						<Text style={styles.textoControle}>+</Text>
					</TouchableOpacity>
				</View>
			</View>

			<TouchableOpacity
				style={styles.botaoFinalizar}
				onPress={() => concluirColeta()}
			>
				<Text style={styles.textoFinalizar}>Finalizar coleta</Text>
			</TouchableOpacity>
		</View>
	</Pressable>
</Modal>
		</View>
	);
};

const styles = StyleSheet.create({
	container: { 
		flex: 1, 
		justifyContent: 'center', 
		alignItems: 'center',
		backgroundColor: "#E2F2DF"
	},

	content: {
		justifyContent: "center",
	},

	botaoFlutuante: {
		position: 'absolute',
		width: 60,
		height: 60,
		backgroundColor: '#A6D89B',  
		borderRadius: 30,
		justifyContent: 'center',
		alignItems: 'center',
		bottom: 30,  
		right: 20,  
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.8,
		shadowRadius: 2,
		elevation: 4,  
	},

	textoBotao: { 
		fontSize: 24,
		color: '#000' 
	},

	overlay: {
		flex: 1, 
		backgroundColor: 'rgba(0, 0, 0, 0.2)',
	},  

	modalContainer: {
		position: 'absolute',
		bottom: 0,
		width: '100%',
		height: '70%',
		backgroundColor: '#FFF',
		borderTopLeftRadius: 20,
		borderTopRightRadius: 20,
		padding: 20,
		alignItems: 'center',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: -2 },
		shadowOpacity: 0.25,
		shadowRadius: 4,
		elevation: 50,
	},

	titulo: { 
		fontSize: 18,
		marginBottom: 5,
		fontFamily: 'Poppins_600SemiBold',
	},
	
	subtitulo: {
		fontSize: 14,
		color: '#666',
		marginBottom: 20,
		textAlign: 'center',
		fontFamily: 'Poppins_400Regular',
	},
	
	listaMateriais: {
		alignItems: 'center',
		justifyContent: 'center' 
	},
	
	colunaMateriais: {
		justifyContent: 'space-around',
		marginBottom: 20 
	},
	
	botaoMaterial: {
		width: 100,
		height: 100,
		borderRadius: 50,
		justifyContent: 'center',
		alignItems: 'center',
		margin: 10,
	},
	
	textoMaterial: {
		fontSize: 14,    
		fontFamily: 'Poppins_600SemiBold',
		color: '#fff'
	},
	
	bolhaXp: {
		position: 'absolute',
		bottom: 5,
		right: 5,
		backgroundColor: '#000',
		borderRadius: 10,
		padding: 5,
	},
	
	textoXp: {
		color: '#FFF',
		fontSize: 10
	},
	
	modalQuantidade: {
		position: 'absolute',
		bottom: 0,
		width: '100%',
		backgroundColor: '#E8E8E8',
		padding: 20,
		borderTopLeftRadius: 20,
		borderTopRightRadius: 20,
		alignItems: 'center',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: -2 },
		shadowOpacity: 0.25,
		shadowRadius: 4,
		elevation: 10,
	},
	
	inputmaterial: {
		flexDirection: 'row',   
		alignItems: 'center',    
		justifyContent: 'center',
		gap: 10,
	},
	
	textoMaterialSelecionado: {
		fontSize: 16,
		marginBottom: 15,
		padding: 10,
		borderRadius: 10,
		backgroundColor: '#fff',
		marginHorizontal: 20,
		fontFamily: 'Poppins_500Medium',
	},
	
	controleQuantidade: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 15,
		paddingHorizontal: 10,
		borderRadius: 10,
		backgroundColor: '#fff',
	},

	botaoControle: {
		backgroundColor: '#E0E0E0',
		borderRadius: 5,
		paddingHorizontal: 7,
		alignItems: 'center'
	},

	textoControle: { 
		fontSize: 16, 
		fontFamily: 'Poppins_600SemiBold',
	},

	textoQuantidade: {
		fontSize: 16,
		width: 50,
		fontFamily: 'Poppins_500Medium',
		textAlign: 'center',
	},

	botaoFinalizar: {
		backgroundColor: '#4CAF50',
		padding: 10,
		borderRadius: 10,
		alignItems: 'center',
		width: '100%'
	},

	textoFinalizar: {
		fontFamily: 'Poppins_600SemiBold',
		color: '#fff',
		fontSize: 16
	},
	
	// estilização quests

	botaoCheck: {
		backgroundColor: "#6BBF59",
		justifyContent: "center",
		borderRadius: 25,
		alignItems: "center",
		paddingHorizontal: 5,
		paddingVertical: 5,
		marginTop: 10,
		flexDirection: 'row'
	},
	
	modalBackdrop: {
		flex: 1,
		backgroundColor: 'rgba(0, 0, 0, 0.4)',
	},

	missaoButton: {
		paddingVertical: 20
	},

	modalContent: {
		backgroundColor: "#fff",
		width: 250,
		borderRadius: 10,
		padding: 15,
		margin: 80
	},

	subtitle: {
		fontFamily: "Poppins_400Regular",
		fontSize: 14,
		color: "#3F463E",
		textAlign: 'center'
	},

	text: {
		fontFamily: "Poppins_400Regular",
		fontSize: 16,
		textAlign: 'center'
	},
	
	textBotao: {
		fontFamily: "Poppins_600SemiBold",
		fontSize: 14,
		color: "#fff",
		justifyContent: 'center',
		textAlign: 'center',
		paddingHorizontal: 2
	},
	
	textCompleted: {
		fontFamily: "Poppins_500Medium",
		fontSize: 14,
		justifyContent: 'center',
		textAlign: 'center',
		backgroundColor: "#E2F2DF",
		borderRadius: 10,
		marginTop: 8,
		padding: 5
	},

	quantidadeContainer: {
		flexDirection: 'row',
		alignItems: 'center',
	},

	  line: {
		position: 'absolute',
		width: 5,
		height: 210,
		backgroundColor: 'gray',
		zIndex: -1, 
	  },

	contentBadge: {
		backgroundColor: "#6BBF59",
		zIndex: 40,
		borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
		padding: 10,
		marginTop: 30,
		flexDirection: 'row',
		width: '100%',
		gap: 20,
		alignItems: 'center',
		justifyContent: 'space-evenly'
	},

	badgeImg: {
		width: 76,
		height: 100,
		elevation: 20
	},

	badgeTitle: {
		fontFamily: 'Poppins_500Medium',
		fontSize: 16,
		backgroundColor: '#fff',
		paddingHorizontal: 10,
		paddingVertical: 3,
		borderTopLeftRadius: 10,
		borderTopRightRadius: 10,
		borderBottomRightRadius: 10,
		bottom: 90,
		position: 'absolute'
	},

	badgeDescription: {
		fontFamily: 'Poppins_400Regular',
		fontSize: 14,
		color: '#fff',
		maxWidth: 260
	},

	badgeState: {
		fontFamily: 'Poppins_400Regular',
		fontSize: 14,
		backgroundColor: "#E2F2DF",
		borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
		paddingHorizontal: 10,
		paddingVertical: 3,
		width: 170,
		marginBottom: 10
	},

	badgeStateA: {
		fontFamily: 'Poppins_400Regular',
		fontSize: 14,
		backgroundColor: "#E2F2DF",
		borderBottomLeftRadius: 10,
    		borderBottomRightRadius: 10,
		paddingHorizontal: 10,
		paddingVertical: 3,
		width: 170,
		top: 25,
		marginBottom: 20
	}
});

export default Trilha;
