'use client';

import React, { useState } from 'react';
import {
  Button,
  Loading,
  LoadingSpinner,
  LoadingDots,
  ErrorMessage,
  WarningMessage,
  InfoMessage,
  Success,
  AnimatedCheckmark,
  SuccessToast,
  Container,
  Grid,
  Stack,
  Flex,
  ShowOn,
  ResponsiveText,
  Fade,
  Slide,
  Scale,
  Stagger,
  Pulse,
  Bounce,
} from '@/components/shared';
import { CheckCircle, Download, Heart } from 'lucide-react';

export default function ComponentsDemo() {
  const [showFade, setShowFade] = useState(true);
  const [showSlide, setShowSlide] = useState(true);
  const [showScale, setShowScale] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAsyncAction = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setLoading(false);
    setShowToast(true);
  };

  return (
    <Container size="xl" padding="lg">
      <div className="space-y-12">
        {/* Header */}
        <div className="text-center">
          <ResponsiveText 
            size={{ mobile: '2xl', desktop: '4xl' }}
            className="font-bold text-gray-900 mb-4"
          >
            UI Components Demo
          </ResponsiveText>
          <p className="text-gray-600 max-w-2xl mx-auto mb-4">
            A showcase of all the shared UI components available in the automated store frontend.
          </p>
          <div className="flex justify-center gap-4">
            <Button variant="outline" onClick={() => window.location.href = '/state-demo'}>
              View State Management Demo
            </Button>
            <Button variant="outline" onClick={() => window.location.href = '/'}>
              Back to Home
            </Button>
          </div>
        </div>

        {/* Buttons Section */}
        <section>
          <h2 className="text-2xl font-semibold mb-6">Buttons</h2>
          <Grid cols={{ xs: 1, sm: 2, md: 3, lg: 4 }} gap="md">
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="success">Success</Button>
            <Button variant="error">Error</Button>
            <Button variant="warning">Warning</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button loading>Loading</Button>
            <Button leftIcon={<Download className="h-4 w-4" />}>
              With Icon
            </Button>
            <Button rightIcon={<Heart className="h-4 w-4" />} variant="error">
              Like
            </Button>
            <Button size="sm">Small</Button>
            <Button size="lg">Large</Button>
          </Grid>
        </section>

        {/* Loading Section */}
        <section>
          <h2 className="text-2xl font-semibold mb-6">Loading States</h2>
          <Grid cols={{ xs: 1, sm: 2, md: 4 }} gap="lg">
            <div className="text-center">
              <h3 className="font-medium mb-4">Spinner</h3>
              <LoadingSpinner size="lg" message="Loading..." />
            </div>
            <div className="text-center">
              <h3 className="font-medium mb-4">Dots</h3>
              <LoadingDots size="lg" message="Processing..." />
            </div>
            <div className="text-center">
              <h3 className="font-medium mb-4">Pulse</h3>
              <Loading variant="pulse" size="lg" message="Syncing..." />
            </div>
            <div className="text-center">
              <h3 className="font-medium mb-4">Bars</h3>
              <Loading variant="bars" size="lg" message="Analyzing..." />
            </div>
          </Grid>
        </section>

        {/* Messages Section */}
        <section>
          <h2 className="text-2xl font-semibold mb-6">Messages</h2>
          <Stack spacing="md">
            <Success
              title="Success!"
              message="Your operation completed successfully."
              details="All items have been processed and saved."
              dismissible
              onDismiss={() => console.log('Success dismissed')}
            />
            <ErrorMessage
              title="Error occurred"
              message="Something went wrong while processing your request."
              onRetry={() => console.log('Retry clicked')}
              dismissible
              onDismiss={() => console.log('Error dismissed')}
            />
            <WarningMessage
              title="Warning"
              message="This action cannot be undone."
              dismissible
              onDismiss={() => console.log('Warning dismissed')}
            />
            <InfoMessage
              title="Information"
              message="This is some helpful information for you."
              dismissible
              onDismiss={() => console.log('Info dismissed')}
            />
          </Stack>
        </section>

        {/* Animations Section */}
        <section>
          <h2 className="text-2xl font-semibold mb-6">Animations</h2>
          <Grid cols={{ xs: 1, md: 3 }} gap="lg">
            <div className="text-center">
              <h3 className="font-medium mb-4">Fade Transition</h3>
              <Button onClick={() => setShowFade(!showFade)} className="mb-4">
                Toggle Fade
              </Button>
              <Fade show={showFade}>
                <div className="bg-primary-100 p-4 rounded-lg">
                  <p>This content fades in and out</p>
                </div>
              </Fade>
            </div>
            
            <div className="text-center">
              <h3 className="font-medium mb-4">Slide Transition</h3>
              <Button onClick={() => setShowSlide(!showSlide)} className="mb-4">
                Toggle Slide
              </Button>
              <Slide show={showSlide} direction="up">
                <div className="bg-success-100 p-4 rounded-lg">
                  <p>This content slides up</p>
                </div>
              </Slide>
            </div>
            
            <div className="text-center">
              <h3 className="font-medium mb-4">Scale Transition</h3>
              <Button onClick={() => setShowScale(!showScale)} className="mb-4">
                Toggle Scale
              </Button>
              <Scale show={showScale}>
                <div className="bg-warning-100 p-4 rounded-lg">
                  <p>This content scales in</p>
                </div>
              </Scale>
            </div>
          </Grid>

          <div className="mt-8">
            <h3 className="font-medium mb-4">Stagger Animation</h3>
            <Stagger delay={150}>
              {['First item', 'Second item', 'Third item', 'Fourth item'].map((item, index) => (
                <div key={index} className="bg-gray-100 p-3 rounded-lg mb-2">
                  {item}
                </div>
              ))}
            </Stagger>
          </div>

          <div className="mt-8 text-center">
            <h3 className="font-medium mb-4">Animated Checkmark</h3>
            <AnimatedCheckmark size="xl" />
          </div>
        </section>

        {/* Responsive Layout Section */}
        <section>
          <h2 className="text-2xl font-semibold mb-6">Responsive Layouts</h2>
          
          <div className="mb-8">
            <h3 className="font-medium mb-4">Flex Layout</h3>
            <Flex justify="between" align="center" className="bg-gray-100 p-4 rounded-lg">
              <span>Left content</span>
              <span>Center content</span>
              <span>Right content</span>
            </Flex>
          </div>

          <div className="mb-8">
            <h3 className="font-medium mb-4">Stack Layout</h3>
            <Stack spacing="md" className="bg-gray-100 p-4 rounded-lg">
              <div className="bg-white p-2 rounded">Item 1</div>
              <div className="bg-white p-2 rounded">Item 2</div>
              <div className="bg-white p-2 rounded">Item 3</div>
            </Stack>
          </div>

          <div className="mb-8">
            <h3 className="font-medium mb-4">Responsive Visibility</h3>
            <ShowOn breakpoint="mobile" className="bg-blue-100 p-4 rounded-lg mb-2">
              <p>This is only visible on mobile devices</p>
            </ShowOn>
            <ShowOn breakpoint="desktop" className="bg-green-100 p-4 rounded-lg">
              <p>This is only visible on desktop devices</p>
            </ShowOn>
          </div>
        </section>

        {/* Interactive Demo */}
        <section>
          <h2 className="text-2xl font-semibold mb-6">Interactive Demo</h2>
          <div className="text-center">
            <Button 
              onClick={handleAsyncAction}
              loading={loading}
              size="lg"
              leftIcon={!loading ? <CheckCircle className="h-5 w-5" /> : undefined}
            >
              {loading ? 'Processing...' : 'Start Demo Action'}
            </Button>
            <p className="text-gray-600 mt-2">
              Click to see loading state and success toast
            </p>
          </div>
        </section>

        {/* Pulse and Bounce */}
        <section>
          <h2 className="text-2xl font-semibold mb-6">Special Effects</h2>
          <Flex justify="center" gap="xl">
            <div className="text-center">
              <h3 className="font-medium mb-4">Pulse Effect</h3>
              <Pulse intensity="normal">
                <div className="bg-primary-200 p-6 rounded-full">
                  <Heart className="h-8 w-8 text-primary-600" />
                </div>
              </Pulse>
            </div>
            <div className="text-center">
              <h3 className="font-medium mb-4">Bounce Effect</h3>
              <Bounce>
                <div className="bg-success-200 p-6 rounded-full">
                  <CheckCircle className="h-8 w-8 text-success-600" />
                </div>
              </Bounce>
            </div>
          </Flex>
        </section>
      </div>

      {/* Success Toast */}
      <SuccessToast
        message="Demo action completed successfully!"
        visible={showToast}
        onClose={() => setShowToast(false)}
      />
    </Container>
  );
}