'use client'

import { useState } from 'react'

interface InstructionStep {
  number: number
  en: string
  kz: string
  ru: string
}

interface BilingualInstructionsProps {
  className?: string
  showLanguageToggle?: boolean
}

const instructionSteps: InstructionStep[] = [
  {
    number: 1,
    en: 'Open your mobile device camera or QR scanner app',
    kz: 'Мобильді құрылғыңыздың камерасын немесе QR сканер қолданбасын ашыңыз',
    ru: 'Откройте камеру мобильного устройства или приложение для сканирования QR-кодов'
  },
  {
    number: 2,
    en: 'Point your camera at the QR code displayed above',
    kz: 'Камераңызды жоғарыда көрсетілген QR кодына бағыттаңыз',
    ru: 'Наведите камеру на QR-код, отображенный выше'
  },
  {
    number: 3,
    en: 'Follow the instructions on your mobile device',
    kz: 'Мобильді құрылғыңыздағы нұсқауларды орындаңыз',
    ru: 'Следуйте инструкциям на вашем мобильном устройстве'
  },
  {
    number: 4,
    en: 'Wait for the compartment to open and retrieve your parcel',
    kz: 'Бөлменің ашылуын күтіп, посылканы алыңыз',
    ru: 'Дождитесь открытия отделения и заберите вашу посылку'
  }
]

export function BilingualInstructions({ className = '', showLanguageToggle = false }: BilingualInstructionsProps) {
  const [language, setLanguage] = useState<'en' | 'kz' | 'ru'>('en')

  const getStepColor = (index: number) => {
    const colors = ['bg-blue-600', 'bg-green-600', 'bg-purple-600', 'bg-orange-600']
    return colors[index % colors.length]
  }

  const renderInstructions = (lang: 'en' | 'kz' | 'ru', title: string) => (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
        <span className="text-2xl mr-2">📱</span>
        {title}
      </h3>
      <div className="space-y-3">
        {instructionSteps.map((step, index) => (
          <div key={step.number} className="flex items-start space-x-3">
            <div className={`flex-shrink-0 w-6 h-6 ${getStepColor(index)} text-white rounded-full flex items-center justify-center text-sm font-bold`}>
              {step.number}
            </div>
            <p className="text-gray-700 leading-relaxed">
              {step[lang]}
            </p>
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <div className={`space-y-6 ${className}`}>
      {showLanguageToggle && (
        <div className="flex justify-center">
          <div className="bg-white rounded-lg p-1 shadow-sm border">
            <button
              onClick={() => setLanguage('kz')}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                language === 'kz' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Қазақша
            </button>
            
            <button
              onClick={() => setLanguage('ru')}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                language === 'ru' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Русский
            </button>
            <button
              onClick={() => setLanguage('en')}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                language === 'en' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              English
            </button>
          </div>
        </div>
      )}

      {language === 'en' && 
        renderInstructions('en', 'How to Pick Up Your Parcel')
      }

      {language === 'ru' && 
        renderInstructions('ru', 'Как забрать вашу посылку')
      }

      {language === 'kz' && 
        renderInstructions('kz', 'Сіздің посылканы қалай алу керек')
      }

      {/* Additional help section
      <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
        <div className="flex items-start space-x-3">
          <div className="text-2xl">💡</div>
          <div>
            <h4 className="font-semibold text-blue-900 mb-2">
              {language === 'kz' ? 'Көмек керек пе?' : 
               language === 'ru' ? 'Нужна помощь?' : 'Need Help?'}
            </h4>
            <p className="text-blue-800 text-sm">
              {language === 'kz' 
                ? 'Егер сізде қиындықтар туындаса, персоналға хабарласыңыз немесе көмек батырмасын басыңыз.'
                : language === 'ru'
                ? 'Если у вас возникли трудности, обратитесь к персоналу или нажмите кнопку помощи.'
                : 'If you experience any difficulties, please contact staff or press the help button.'
              }
            </p>
          </div>
        </div>
      </div> */}
    </div>
  )
}