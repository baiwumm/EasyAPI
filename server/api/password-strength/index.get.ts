/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2025-09-19 16:25:44
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2025-09-19 16:59:28
 * @Description: 密码强度检测
 */
import { formatSuccess, formatFail } from "~/lib/constant";

export default defineEventHandler((event) => {
  try {
    const query = getQuery(event)
    const password = (query.password as string) || '';

    if (!password) {
      return formatFail("参数 password 必填");
    }

    if (password.length > 128) {
      return formatFail("参数 password 长度不能超过 128 个字符");
    }

    // 判断是否包含重复字符
    const hasRepeatedChars = (password: string): boolean => {
      for (let i = 0; i < password.length - 2; i++) {
        if (password[i] === password[i + 1] && password[i] === password[i + 2]) {
          return true
        }
      }
      return false
    }

    // 判断是否包含顺序字符
    const hasSequentialChars = (password: string): boolean => {
      const sequences = [
        'abcdefghijklmnopqrstuvwxyz',
        'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        '0123456789',
        'qwertyuiop',
        'asdfghjkl',
        'zxcvbnm',
      ]

      for (const seq of sequences) {
        for (let i = 0; i <= seq.length - 3; i++) {
          const subSeq = seq.substring(i, i + 3)
          if (password.includes(subSeq) || password.includes(subSeq.split('').reverse().join(''))) {
            return true
          }
        }
      }
      return false
    }

    // 计算密码得分
    const calculateEntropy = (password: string, charsetSize: number): number => {
      if (charsetSize === 0) return 0
      return Math.round(password.length * Math.log2(charsetSize) * 100) / 100
    }

    // 计算密码得分
    const calculatePasswordScore = (analysis: {
      hasLowercase: boolean
      hasUppercase: boolean
      hasNumbers: boolean
      hasSymbols: boolean
      hasRepeated: boolean
      hasSequential: boolean
      length: number
    }): number => {
      let score = 0

      score += analysis.length * 4

      if (analysis.hasLowercase) score += 2
      if (analysis.hasUppercase) score += 2
      if (analysis.hasNumbers) score += 4
      if (analysis.hasSymbols) score += 6

      const varietyCount = [
        analysis.hasLowercase,
        analysis.hasUppercase,
        analysis.hasNumbers,
        analysis.hasSymbols,
      ].filter(Boolean).length
      score += varietyCount * 2

      if (analysis.length >= 8) score += 5
      if (analysis.length >= 12) score += 5
      if (analysis.length >= 16) score += 5

      return score
    }

    // 判断密码强弱程度
    const getStrengthFromScore = (score: number) => {
      if (score < 30) {
        return { level: '极弱', description: '密码过于简单，需要立即改进' }
      } else if (score < 50) {
        return { level: '弱', description: '密码强度不足，建议增强' }
      } else if (score < 70) {
        return { level: '中等', description: '密码强度一般，可以进一步改进' }
      } else if (score < 85) {
        return { level: '强', description: '密码强度良好' }
      } else {
        return { level: '极强', description: '密码强度优秀' }
      }
    }

    // 暴力破解所需时间
    const getTimeToCrack = (entropy: number) => {
      const combinations = Math.pow(2, entropy)
      const attemptsPerSecond = 1000000000 // 10亿次/秒的暴力破解速度
      const secondsToCrack = combinations / (2 * attemptsPerSecond) // 平均破解时间

      if (secondsToCrack < 1) {
        return '< 1秒'
      } else if (secondsToCrack < 60) {
        return `${Math.round(secondsToCrack)}秒`
      } else if (secondsToCrack < 3600) {
        return `${Math.round(secondsToCrack / 60)}分钟`
      } else if (secondsToCrack < 86400) {
        return `${Math.round(secondsToCrack / 3600)}小时`
      } else if (secondsToCrack < 31536000) {
        return `${Math.round(secondsToCrack / 86400)}天`
      } else if (secondsToCrack < 31536000000) {
        return `${Math.round(secondsToCrack / 31536000)}年`
      } else {
        return '数百万年'
      }
    }

    // 密码建议
    const getPasswordRecommendations = (
      password: string,
      analysis: {
        hasLowercase: boolean
        hasUppercase: boolean
        hasNumbers: boolean
        hasSymbols: boolean
        hasRepeated: boolean
        hasSequential: boolean
        length: number
        score: number
      },
    ): string[] => {
      const recommendations: string[] = []

      if (analysis.length < 8) {
        recommendations.push('建议密码长度至少 8 位')
      } else if (analysis.length < 12) {
        recommendations.push('建议密码长度至少 12 位以获得更好安全性')
      }

      if (!analysis.hasLowercase) {
        recommendations.push('建议包含小写字母')
      }
      if (!analysis.hasUppercase) {
        recommendations.push('建议包含大写字母')
      }
      if (!analysis.hasNumbers) {
        recommendations.push('建议包含数字')
      }
      if (!analysis.hasSymbols) {
        recommendations.push('建议包含特殊符号')
      }

      if (analysis.hasRepeated) {
        recommendations.push('避免连续重复字符')
      }
      if (analysis.hasSequential) {
        recommendations.push('避免使用连续序列字符')
      }

      if (analysis.score >= 85) {
        recommendations.push('密码强度已经很好！')
      }

      return recommendations
    }

    const length = password.length; // 密码长度
    const hasLowercase = /[a-z]/.test(password); // 是否包含小写字母
    const hasUppercase = /[A-Z]/.test(password); // 是否包含大写字母
    const hasNumbers = /\d/.test(password); // 是否包含数字
    const hasSymbols = /[^a-zA-Z0-9]/.test(password); // 是否包含符号
    const hasRepeated = hasRepeatedChars(password); // 是否包含重复字符
    const hasSequential = hasSequentialChars(password); // 是否包含顺序字符

    let characterVariety = 0
    if (hasLowercase) characterVariety += 26
    if (hasUppercase) characterVariety += 26
    if (hasNumbers) characterVariety += 10
    if (hasSymbols) characterVariety += 32

    const entropy = calculateEntropy(password, characterVariety)
    let score = calculatePasswordScore({
      hasLowercase,
      hasUppercase,
      hasNumbers,
      hasSymbols,
      hasRepeated,
      hasSequential,
      length,
    })

    if (hasRepeated) score -= 10
    if (hasSequential) score -= 15

    score = Math.max(0, Math.min(100, score))

    const strength = getStrengthFromScore(score)
    const timeToCrack = getTimeToCrack(entropy)
    const recommendations = getPasswordRecommendations(password, {
      hasLowercase,
      hasUppercase,
      hasNumbers,
      hasSymbols,
      hasRepeated,
      hasSequential,
      length,
      score,
    })

    return formatSuccess({
      password,
      length,
      score,
      strength: strength.level,
      entropy,
      time_to_crack: timeToCrack,
      character_analysis: {
        has_lowercase: hasLowercase,
        has_uppercase: hasUppercase,
        has_numbers: hasNumbers,
        has_symbols: hasSymbols,
        has_repeated: hasRepeated,
        has_sequential: hasSequential,
        character_variety: characterVariety,
      },
      recommendations,
    })

  } catch (error) {
    return formatFail((error as Error)?.message || "密码强度检测失败");
  }
})
