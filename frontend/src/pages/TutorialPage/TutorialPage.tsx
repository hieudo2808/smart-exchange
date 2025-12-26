import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../../components/LanguageSwitcher';
import { userService } from '../../services/user.service';
import { useAuth } from '../../contexts/AuthContext';
import './TutorialPage.css';

const TutorialPage: React.FC = () => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const stepsConfig = [
    {
      id: "01",
      titleKey: "tutorial.steps.step1.title",
      descKey: "tutorial.steps.step1.desc",
      icon: "💬"
    },
    {
      id: "02",
      titleKey: "tutorial.steps.step2.title",
      descKey: "tutorial.steps.step2.desc",
      icon: "🤖"
    },
    {
      id: "03",
      titleKey: "tutorial.steps.step3.title",
      descKey: "tutorial.steps.step3.desc",
      icon: "✨"
    }
  ];

  // Hàm xử lý khi bấm nút "Bắt đầu chat" hoặc nút "Đã hiểu"
  const handleComplete = async () => {
    try {
      setIsLoading(true);
      
      // 1. Gọi API báo cho server biết user đã học xong (để lần sau không hiện lại)
      const updatedUser = await userService.completeTutorial();
      
      // 2. Cập nhật user context - map từ UserProfile sang User interface
      setUser({
        id: updatedUser.id,
        email: updatedUser.email,
        jobTitle: updatedUser.jobTitle,
        isTutorialCompleted: updatedUser.isTutorialCompleted,
      });
      
      // 3. QUAN TRỌNG: Chuyển hướng sang trang Chat thay vì trang chủ
      navigate('/chat', { replace: true }); 

        {/* 4. BOTTOM CTA */}

      </main>
    </div>
  );
};

export default TutorialPage;
