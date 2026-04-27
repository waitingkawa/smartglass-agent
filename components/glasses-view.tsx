"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Home, Bike, Users, Sparkles, Volume2, MessageSquare, Send, Presentation } from "lucide-react"
import { cn } from "@/lib/utils"

type Scene = "home" | "cycling" | "meeting" | "conversation"

interface SceneData {
  id: Scene
  name: string
  icon: React.ReactNode
  image: string
  messages: {
    text: string
    delay: number
  }[]
  hud: {
    time: string
    battery: number
    temperature?: string
    speed?: string
    heartRate?: string
    meetingInfo?: string
  }
}

const scenes: SceneData[] = [
  {
    id: "home",
    name: "居家",
    icon: <Home className="w-4 h-4" />,
    image: "/images/scene-home.jpg",
    messages: [
      { text: "早上好！检测到您正在客厅休息。", delay: 0 },
      { text: "今日天气晴朗，室外温度22°C，适合外出活动。", delay: 1500 },
      { text: "您的咖啡温度正在下降，建议在5分钟内饮用以获得最佳口感。", delay: 3500 },
      { text: "提醒：您今天10点有一个工作会议，需要我帮您准备会议资料吗？", delay: 6000 },
    ],
    hud: {
      time: "08:32",
      battery: 85,
      temperature: "24°C",
    },
  },
  {
    id: "cycling",
    name: "骑行",
    icon: <Bike className="w-4 h-4" />,
    image: "/images/scene-cycling.jpg",
    messages: [
      { text: "检测到骑行模式，已开启骑行导航辅助。", delay: 0 },
      { text: "当前速度 18km/h，心率 125bpm，状态良好。", delay: 1500 },
      { text: "前方200米右转进入滨江绿道，请减速慢行。", delay: 3500 },
      { text: "提醒：您已骑行45分钟，消耗约320大卡，建议适时补充水分。", delay: 6000 },
    ],
    hud: {
      time: "09:15",
      battery: 72,
      speed: "18 km/h",
      heartRate: "125 bpm",
    },
  },
  {
    id: "meeting",
    name: "会议",
    icon: <Presentation className="w-4 h-4" />,
    image: "/images/scene-conference.jpg",
    messages: [
      { text: "检测到会议场景，已自动开启会议记录模式。", delay: 0 },
      { text: "本次会议：Q2产品规划会，参会人员6人。", delay: 1500 },
      { text: "讨论要点：产品迭代方向、用户反馈分析、下季度目标设定。", delay: 3500 },
      { text: "提醒：您准备的数据报告尚未展示，需要我在适当时机提醒您吗？", delay: 6000 },
    ],
    hud: {
      time: "10:05",
      battery: 68,
      meetingInfo: "Q2产品规划会",
    },
  },
  {
    id: "conversation",
    name: "对话",
    icon: <Users className="w-4 h-4" />,
    image: "/images/scene-meeting.jpg",
    messages: [
      { text: "检测到对话场景，已开启实时翻译与记录功能。", delay: 0 },
      { text: "对话者：Mike (英语)，正在为您实时翻译。", delay: 1500 },
      { text: "翻译：\"我们计划下周发布新版本，需要你们团队的支持。\"", delay: 3500 },
      { text: "建议回复：\"没问题，我们会全力配合。\" 需要我帮您组织语言吗？", delay: 6000 },
    ],
    hud: {
      time: "14:30",
      battery: 55,
    },
  },
]

export function GlassesView() {
  const [currentScene, setCurrentScene] = useState<Scene>("home")
  const [visibleMessages, setVisibleMessages] = useState<number[]>([])
  const [isTransitioning, setIsTransitioning] = useState(false)

  // 新增状态
  const [scenario, setScenario] = useState("")
  const [aiResponse, setAiResponse] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTimer, setRecordingTimer] = useState(0)

  const currentSceneData = scenes.find((s) => s.id === currentScene)!

  useEffect(() => {
    setVisibleMessages([])

    const timeouts: NodeJS.Timeout[] = []

    currentSceneData.messages.forEach((msg, index) => {
      const timeout = setTimeout(() => {
        setVisibleMessages((prev) => [...prev, index])
      }, msg.delay)
      timeouts.push(timeout)
    })

    return () => {
      timeouts.forEach(clearTimeout)
    }
  }, [currentScene, currentSceneData.messages])

  // 录像计时器
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTimer((prev) => prev + 1)
      }, 1000)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isRecording])

  const handleSceneChange = (scene: Scene) => {
    if (scene === currentScene) return
    setIsTransitioning(true)
    setTimeout(() => {
      setCurrentScene(scene)
      setIsTransitioning(false)
    }, 300)
  }

  const stopRecording = () => {
    setIsRecording(false)
    setAiResponse(`录像已停止，共录制 ${Math.floor(recordingTimer / 60)}分${recordingTimer % 60}秒`)
  }


  const handleGenerate = async () => {
    if (!scenario.trim()) return

    setIsLoading(true)
    setAiResponse("")

    try {
      const res = await fetch("/api/generate-response", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ scenario }),
      })

      if (!res.ok) {
        throw new Error("Failed to generate response")
      }

      const data = await res.json()
      setAiResponse(data.response)

      // 处理录像动作
      if (data.action === "startRecording") {
        setIsRecording(true)
        setRecordingTimer(0)
      }

    } catch (error) {
      console.error(error)
      setAiResponse("抱歉，生成回复时出错。")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col w-full h-screen bg-black">
      {/* 眼镜第一视角区域 */}
      <div className="relative flex-1 m-4 mb-0 rounded-[40px] overflow-hidden border-4 border-zinc-800">
        {/* 场景背景图 */}
        <div
          className={cn(
            "absolute inset-0 transition-opacity duration-300",
            isTransitioning ? "opacity-0" : "opacity-100"
          )}
        >
          <Image
            src={currentSceneData.image}
            alt={currentSceneData.name}
            fill
            className="object-cover"
            priority
          />
          {/* 眼镜边框效果 */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/10" />
            <div
              className="absolute inset-0"
              style={{
                boxShadow: "inset 0 0 80px 30px rgba(0,0,0,0.3)",
              }}
            />
          </div>
        </div>



        {/* 录像状态指示器 - 画面中下方 */}
        {isRecording && (
          <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-10">
            <div className="flex items-center gap-3 bg-red-500/90 backdrop-blur-md px-4 py-2 rounded-full shadow-lg">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-white animate-pulse" />
                <span className="text-white text-sm font-mono">
                  REC {Math.floor(recordingTimer / 60)}:{String(recordingTimer % 60).padStart(2, '0')}
                </span>
              </div>
              <button
                onClick={stopRecording}
                className="px-3 py-1 bg-white/20 rounded-full text-white text-sm hover:bg-white/30 transition-colors"
              >
                停止
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 底部控制区域 */}
      <div className="p-4 space-y-4">
        {/* 场景切换按钮 - 底部 */}
        <div className="flex justify-center">
          <div className="flex gap-2 bg-zinc-900/80 backdrop-blur-md p-2 rounded-full border border-zinc-800">
            {scenes.map((scene) => (
              <button
                key={scene.id}
                onClick={() => handleSceneChange(scene.id)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-full transition-all",
                  currentScene === scene.id
                    ? "bg-white text-black"
                    : "text-white/80 hover:bg-white/20"
                )}
              >
                {scene.icon}
                <span className="text-sm font-medium">{scene.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* AI 助手语音回复和输入框 */}
        <div className="flex items-center gap-4">
          {/* AI 助手语音回复 - 底部左侧滚动显示 */}
          <div className="flex-1">
            <div className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden">
              <div className="flex items-center gap-3 px-4 py-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center shrink-0 opacity-80">
                  <Sparkles className="w-5 h-5 text-white opacity-80" />
                </div>
                <div className="flex-1 overflow-hidden">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-white font-semibold text-sm">AI 助手</h3>
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  </div>
                  <div className="relative h-6 overflow-hidden">
                    {/* 显示静态消息或 AI 生成的回复 */}
                    {aiResponse ? (
                       <p className="text-white/80 text-sm leading-relaxed absolute inset-0 transition-all duration-500 whitespace-nowrap overflow-hidden text-ellipsis opacity-100 translate-y-0">
                         {isLoading ? "思考中..." : aiResponse}
                       </p>
                    ) : (
                      currentSceneData.messages.map((msg, index) => (
                        <p
                          key={index}
                          className={cn(
                            "text-white/80 text-sm leading-relaxed absolute inset-0 transition-all duration-500 whitespace-nowrap overflow-hidden text-ellipsis",
                            visibleMessages.length > 0 && visibleMessages[visibleMessages.length - 1] === index
                              ? "opacity-100 translate-y-0"
                              : "opacity-0 translate-y-4"
                          )}
                        >
                          {msg.text}
                        </p>
                      ))
                    )}
                  </div>
                </div>
                <button className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors shrink-0">
                  <Volume2 className="w-4 h-4 text-white/80" />
                </button>
              </div>
            </div>
          </div>

          {/* 情景输入框 - 底部右侧 */}
          <div className="w-80 shrink-0">
            <div className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden">
              <div className="flex items-center gap-3 px-4 py-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shrink-0 opacity-80">
                  <MessageSquare className="w-5 h-5 text-white opacity-80" />
                </div>
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="聊天/（提醒）/录视频..."
                    value={scenario}
                    onChange={(e) => setScenario(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
                    className="w-full bg-transparent text-white text-sm placeholder:text-white/40 outline-none"
                  />
                </div>
                <button
                  onClick={handleGenerate}
                  disabled={isLoading}
                  className="w-8 h-8 rounded-full bg-cyan-500 flex items-center justify-center hover:bg-cyan-400 transition-colors shrink-0 disabled:opacity-50"
                >
                  <Send className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
